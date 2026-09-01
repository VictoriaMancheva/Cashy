package com.cashy.service;

import com.cashy.dto.ReceiptScanResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReceiptScanService {

    private final ObjectMapper objectMapper;

    @Value("${anthropic.api.key}")
    private String anthropicApiKey;

    private static final String UPLOADS_DIR = "uploads/receipts";
    private static final String RECEIPT_URL_PREFIX = "/uploads/receipts/";
    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
    private static final String CLAUDE_MODEL = "claude-sonnet-4-6";
    private static final int MAX_TOKENS = 256;
    private static final String ANTHROPIC_VERSION = "2023-06-01";
    private static final String EXTRACT_PROMPT =
            "Extract the total amount, date, and a brief description from this receipt. " +
            "Respond with ONLY a JSON object in this exact format: " +
            "{\"amount\": <number>, \"description\": \"<merchant or item description>\", \"date\": \"<YYYY-MM-DD>\"}. " +
            "If you cannot find a value, use null for that field.";

    public ReceiptScanResponse scanReceipt(MultipartFile file) throws IOException, InterruptedException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadDir = Paths.get(UPLOADS_DIR);
        Files.createDirectories(uploadDir);
        Path filePath = uploadDir.resolve(filename);
        file.transferTo(filePath);

        String receiptImageUrl = RECEIPT_URL_PREFIX + filename;
        String mediaType = file.getContentType() != null ? file.getContentType() : "image/jpeg";
        String base64Data = Base64.getEncoder().encodeToString(Files.readAllBytes(filePath));

        String claudeText = callClaudeApi(base64Data, mediaType);
        return buildResponse(claudeText, receiptImageUrl);
    }

    private String callClaudeApi(String base64Data, String mediaType) throws IOException, InterruptedException {
        String requestBody = buildRequestBody(base64Data, mediaType);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ANTHROPIC_API_URL))
                .header("x-api-key", anthropicApiKey)
                .header("anthropic-version", ANTHROPIC_VERSION)
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("Claude API returned status " + response.statusCode());
        }

        JsonNode root = objectMapper.readTree(response.body());
        return root.path("content").get(0).path("text").asText();
    }

    private String buildRequestBody(String base64Data, String mediaType) throws IOException {
        ObjectNode imageSource = objectMapper.createObjectNode()
                .put("type", "base64")
                .put("media_type", mediaType)
                .put("data", base64Data);

        ObjectNode imageContent = objectMapper.createObjectNode().put("type", "image");
        imageContent.set("source", imageSource);

        ObjectNode textContent = objectMapper.createObjectNode()
                .put("type", "text")
                .put("text", EXTRACT_PROMPT);

        ArrayNode contentArray = objectMapper.createArrayNode().add(imageContent).add(textContent);

        ObjectNode message = objectMapper.createObjectNode().put("role", "user");
        message.set("content", contentArray);

        ObjectNode body = objectMapper.createObjectNode()
                .put("model", CLAUDE_MODEL)
                .put("max_tokens", MAX_TOKENS);
        body.set("messages", objectMapper.createArrayNode().add(message));

        return objectMapper.writeValueAsString(body);
    }

    private ReceiptScanResponse buildResponse(String rawText, String receiptImageUrl) throws IOException {
        String cleaned = rawText.trim()
                .replaceAll("(?s)^```json\\s*", "")
                .replaceAll("(?s)\\s*```$", "")
                .trim();

        JsonNode node = objectMapper.readTree(cleaned);

        Double amount = node.has("amount") && !node.get("amount").isNull()
                ? node.get("amount").asDouble() : null;
        String description = node.has("description") && !node.get("description").isNull()
                ? node.get("description").asText() : null;
        String date = node.has("date") && !node.get("date").isNull()
                ? node.get("date").asText() : null;

        return new ReceiptScanResponse(amount, description, date, receiptImageUrl);
    }
}
