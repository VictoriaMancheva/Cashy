package com.cashy.controller;

import com.cashy.dto.PaymentMethodRequest;
import com.cashy.dto.PaymentMethodResponse;
import com.cashy.service.PaymentMethodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<List<PaymentMethodResponse>> getPaymentMethods() {
        return ResponseEntity.ok(paymentMethodService.getPaymentMethods());
    }

    @PostMapping
    public ResponseEntity<PaymentMethodResponse> createPaymentMethod(@Valid @RequestBody PaymentMethodRequest request) {
        return ResponseEntity.ok(paymentMethodService.createPaymentMethod(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethodResponse> updatePaymentMethod(
            @PathVariable Long id,
            @Valid @RequestBody PaymentMethodRequest request) {
        return ResponseEntity.ok(paymentMethodService.updatePaymentMethod(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.noContent().build();
    }
}
