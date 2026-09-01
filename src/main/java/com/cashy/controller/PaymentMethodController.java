package com.cashy.controller;

import com.cashy.dto.PaymentMethodRequest;
import com.cashy.dto.PaymentMethodResponse;
import com.cashy.service.PaymentMethodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.cashy.util.Constant.ID_PATH;
import static com.cashy.util.Constant.PAYMENT_METHODS_PATH;

@RestController
@RequestMapping(PAYMENT_METHODS_PATH)
@RequiredArgsConstructor
@Tag(name = "Payment Methods", description = "Manage payment methods (cash, card, bank transfer, etc.)")
@SecurityRequirement(name = "bearerAuth")
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    @Operation(summary = "List all payment methods for the current user")
    @GetMapping
    public ResponseEntity<List<PaymentMethodResponse>> getPaymentMethods() {
        return ResponseEntity.ok(paymentMethodService.getPaymentMethods());
    }

    @Operation(summary = "Create a new payment method")
    @PostMapping
    public ResponseEntity<PaymentMethodResponse> createPaymentMethod(@Valid @RequestBody PaymentMethodRequest request) {
        return ResponseEntity.ok(paymentMethodService.createPaymentMethod(request));
    }

    @Operation(summary = "Update an existing payment method")
    @PutMapping(ID_PATH)
    public ResponseEntity<PaymentMethodResponse> updatePaymentMethod(
            @PathVariable Long id,
            @Valid @RequestBody PaymentMethodRequest request) {
        return ResponseEntity.ok(paymentMethodService.updatePaymentMethod(id, request));
    }

    @Operation(summary = "Delete a payment method by ID")
    @DeleteMapping(ID_PATH)
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.noContent().build();
    }
}
