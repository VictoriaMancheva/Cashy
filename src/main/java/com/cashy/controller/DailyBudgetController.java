package com.cashy.controller;

import com.cashy.dto.DailyBudgetRequest;
import com.cashy.dto.DailyBudgetResponse;
import com.cashy.service.DailyBudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-budgets")
@RequiredArgsConstructor
public class DailyBudgetController {

    private final DailyBudgetService dailyBudgetService;

    @GetMapping
    public ResponseEntity<List<DailyBudgetResponse>> getDailyBudgets() {
        return ResponseEntity.ok(dailyBudgetService.getDailyBudgets());
    }

    @PostMapping
    public ResponseEntity<DailyBudgetResponse> setDailyBudget(@Valid @RequestBody DailyBudgetRequest request) {
        return ResponseEntity.ok(dailyBudgetService.setDailyBudget(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDailyBudget(@PathVariable Long id) {
        dailyBudgetService.deleteDailyBudget(id);
        return ResponseEntity.noContent().build();
    }
}
