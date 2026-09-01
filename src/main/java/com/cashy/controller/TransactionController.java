package com.cashy.controller;

import com.cashy.dto.TransactionRequest;
import com.cashy.dto.TransactionResponse;
import com.cashy.entity.Transaction;
import com.cashy.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import static com.cashy.util.Constant.TRANSACTIONS_PATH;

@RestController
@RequestMapping(TRANSACTIONS_PATH)
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Create and manage income and expense transactions")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(summary = "List transactions", description = "Return all transactions for the current user. Optionally filter by type, or by date range (from + to).")
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @RequestParam(required = false) Transaction.TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        if (type != null) {
            return ResponseEntity.ok(transactionService.getTransactionsByType(type));
        }
        if (from != null && to != null) {
            return ResponseEntity.ok(transactionService.getTransactionsByDateRange(from, to));
        }
        return ResponseEntity.ok(transactionService.getTransactions());
    }

    @PostMapping
    @Operation(summary = "Create transaction", description = "Record a new income or expense transaction. Triggers budget and daily-limit checks.")
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.createTransaction(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update transaction")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete transaction")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
