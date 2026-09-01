package com.cashy.controller;

import com.cashy.dto.ForecastResponse;
import com.cashy.dto.ReceiptScanResponse;
import com.cashy.service.AnalyticsService;
import com.cashy.service.ReceiptScanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static com.cashy.util.Constant.PREMIUM_PATH;

@RestController
@RequestMapping(PREMIUM_PATH)
@RequiredArgsConstructor
@Tag(name = "Premium", description = "Premium-only features available to PREMIUM and ADMIN users")
@SecurityRequirement(name = "bearerAuth")
public class PremiumController {

    private final ReceiptScanService receiptScanService;
    private final AnalyticsService analyticsService;

    @Operation(summary = "Scan a receipt image and extract transaction details via AI vision (Premium)")
    @PostMapping("/receipts/scan")
    public ResponseEntity<ReceiptScanResponse> scanReceipt(@RequestParam("file") MultipartFile file)
            throws IOException, InterruptedException {
        return ResponseEntity.ok(receiptScanService.scanReceipt(file));
    }

    @Operation(summary = "Get next-month linear regression forecast based on the last 12 months (Premium)")
    @GetMapping("/analytics/forecast")
    public ResponseEntity<ForecastResponse> getForecast() {
        return ResponseEntity.ok(analyticsService.getForecast());
    }
}
