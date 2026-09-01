package com.cashy.controller;

import com.cashy.dto.RecurringTransactionRequest;
import com.cashy.dto.RecurringTransactionResponse;
import com.cashy.dto.TransactionResponse;
import com.cashy.service.RecurringTransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.cashy.util.Constant.*;

@RestController
@RequestMapping(RECURRING_TRANSACTIONS_PATH)
@RequiredArgsConstructor
@Tag(name = "Recurring Transactions", description = "Define repeating income or expense rules that are applied automatically on a weekly or monthly schedule")
@SecurityRequirement(name = "bearerAuth")
public class RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;

    @Operation(summary = "List all recurring transaction rules for the current user")
    @GetMapping
    public ResponseEntity<List<RecurringTransactionResponse>> getRecurringTransactions() {
        return ResponseEntity.ok(recurringTransactionService.getRecurringTransactions());
    }

    @Operation(summary = "Create a new recurring transaction rule")
    @PostMapping
    public ResponseEntity<RecurringTransactionResponse> createRecurringTransaction(
            @Valid @RequestBody RecurringTransactionRequest request) {
        return ResponseEntity.ok(recurringTransactionService.createRecurringTransaction(request));
    }

    @Operation(summary = "Update an existing recurring transaction rule")
    @PutMapping(ID_PATH)
    public ResponseEntity<RecurringTransactionResponse> updateRecurringTransaction(
            @PathVariable Long id,
            @Valid @RequestBody RecurringTransactionRequest request) {
        return ResponseEntity.ok(recurringTransactionService.updateRecurringTransaction(id, request));
    }

    @Operation(summary = "Manually apply a recurring transaction rule immediately")
    @PostMapping(APPLY_PATH)
    public ResponseEntity<TransactionResponse> applyRecurringTransaction(@PathVariable Long id) {
        return ResponseEntity.ok(recurringTransactionService.applyRecurringTransaction(id));
    }

    @Operation(summary = "Delete a recurring transaction rule by ID")
    @DeleteMapping(ID_PATH)
    public ResponseEntity<Void> deleteRecurringTransaction(@PathVariable Long id) {
        recurringTransactionService.deleteRecurringTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
