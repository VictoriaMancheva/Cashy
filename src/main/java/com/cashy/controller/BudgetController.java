package com.cashy.controller;

import com.cashy.dto.BudgetRequest;
import com.cashy.dto.BudgetResponse;
import com.cashy.service.BudgetService;
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
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets() {
        return ResponseEntity.ok(budgetService.getBudgets());
    }

    @GetMapping(ID_PATH)
    public ResponseEntity<BudgetResponse> getBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudget(id));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.createBudget(request));
    }

    @PutMapping(ID_PATH)
    public ResponseEntity<BudgetResponse> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.updateBudget(id, request));
    }

    @DeleteMapping(ID_PATH)
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}
