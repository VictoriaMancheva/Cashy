package com.cashy.controller;

import com.cashy.dto.RecurringTransactionRequest;
import com.cashy.dto.RecurringTransactionResponse;
import com.cashy.dto.TransactionResponse;
import com.cashy.service.RecurringTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring-transactions")
@RequiredArgsConstructor
public class RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;

    @GetMapping
    public ResponseEntity<List<RecurringTransactionResponse>> getRecurringTransactions() {
        return ResponseEntity.ok(recurringTransactionService.getRecurringTransactions());
    }

    @PostMapping
    public ResponseEntity<RecurringTransactionResponse> createRecurringTransaction(
            @Valid @RequestBody RecurringTransactionRequest request) {
        return ResponseEntity.ok(recurringTransactionService.createRecurringTransaction(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringTransactionResponse> updateRecurringTransaction(
            @PathVariable Long id,
            @Valid @RequestBody RecurringTransactionRequest request) {
        return ResponseEntity.ok(recurringTransactionService.updateRecurringTransaction(id, request));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<TransactionResponse> applyRecurringTransaction(@PathVariable Long id) {
        return ResponseEntity.ok(recurringTransactionService.applyRecurringTransaction(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurringTransaction(@PathVariable Long id) {
        recurringTransactionService.deleteRecurringTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
