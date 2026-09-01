package com.cashy.controller;

import com.cashy.dto.BudgetRequest;
import com.cashy.dto.BudgetResponse;
import com.cashy.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.cashy.util.Constant.BUDGETS_PATH;
import static com.cashy.util.Constant.ID_PATH;

@RestController
@RequestMapping(BUDGETS_PATH)
@RequiredArgsConstructor
@Tag(name = "Budgets", description = "Manage monthly budgets with optional per-category spending limits")
@SecurityRequirement(name = "bearerAuth")
public class BudgetController {

    private final BudgetService budgetService;

    @Operation(summary = "List all budgets for the current user")
    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets() {
        return ResponseEntity.ok(budgetService.getBudgets());
    }

    @Operation(summary = "Get a single budget by ID")
    @GetMapping(ID_PATH)
    public ResponseEntity<BudgetResponse> getBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudget(id));
    }

    @Operation(summary = "Create a new budget")
    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.createBudget(request));
    }

    @Operation(summary = "Replace an existing budget")
    @PutMapping(ID_PATH)
    public ResponseEntity<BudgetResponse> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.updateBudget(id, request));
    }

    @Operation(summary = "Delete a budget by ID")
    @DeleteMapping(ID_PATH)
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}
