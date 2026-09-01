package com.cashy.controller;

import com.cashy.dto.DailyBudgetRequest;
import com.cashy.dto.DailyBudgetResponse;
import com.cashy.service.DailyBudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.cashy.util.Constant.DAILY_BUDGETS_PATH;
import static com.cashy.util.Constant.ID_PATH;

@RestController
@RequestMapping(DAILY_BUDGETS_PATH)
@RequiredArgsConstructor
@Tag(name = "Daily Budgets", description = "Set and manage per-day spending limits")
@SecurityRequirement(name = "bearerAuth")
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

    @DeleteMapping(ID_PATH)
    public ResponseEntity<Void> deleteDailyBudget(@PathVariable Long id) {
        dailyBudgetService.deleteDailyBudget(id);
        return ResponseEntity.noContent().build();
    }
}
