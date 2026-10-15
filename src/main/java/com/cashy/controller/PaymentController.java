package com.cashy.controller;

import com.cashy.dto.CheckoutSessionResponse;
import com.cashy.dto.PaymentResponse;
import com.cashy.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.cashy.util.Constant.*;

@RestController
@RequestMapping(PAYMENTS_PATH)
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Upgrade to Premium with Stripe Checkout")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private static final String STRIPE_SIGNATURE_HEADER = "Stripe-Signature";

    private final PaymentService paymentService;

    @Operation(summary = "Start a Stripe Checkout session for the Premium upgrade")
    @PostMapping(CHECKOUT_SESSION_PATH)
    public ResponseEntity<CheckoutSessionResponse> createCheckoutSession() {
        return ResponseEntity.ok(paymentService.createCheckoutSession());
    }

    @Operation(summary = "Verify a finished Checkout session with Stripe and activate Premium")
    @PostMapping(CONFIRM_PATH)
    public ResponseEntity<PaymentResponse> confirmPayment(@RequestParam String sessionId) {
        return ResponseEntity.ok(paymentService.confirmPayment(sessionId));
    }

    @Operation(summary = "List the current user's payments")
    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getPayments() {
        return ResponseEntity.ok(paymentService.getPayments());
    }

    @Operation(summary = "Stripe webhook (called by Stripe, verified by signature)")
    @PostMapping(WEBHOOK_PATH)
    public ResponseEntity<Void> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(STRIPE_SIGNATURE_HEADER) String signature) {
        paymentService.handleWebhook(payload, signature);
        return ResponseEntity.ok().build();
    }
}
