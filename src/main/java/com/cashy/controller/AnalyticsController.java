package com.cashy.controller;

import com.cashy.dto.CategoryBreakdownResponse;
import com.cashy.dto.MonthlyBreakdownResponse;
import com.cashy.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

import static com.cashy.util.Constant.*;

@RestController
@RequestMapping(ANALYTICS_PATH)
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Spending breakdowns, monthly trends, and next-month linear regression forecast")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Operation(summary = "Get monthly income and expense totals for the last 12 months")
    @GetMapping(MONTHLY_PATH)
    public ResponseEntity<List<MonthlyBreakdownResponse>> getMonthlyBreakdown() {
        return ResponseEntity.ok(analyticsService.getMonthlyBreakdown());
    }

    @Operation(summary = "Get spending breakdown by category for a given month and year")
    @GetMapping(BY_CATEGORY_PATH)
    public ResponseEntity<List<CategoryBreakdownResponse>> getCategoryBreakdown(
            @RequestParam(defaultValue = "0") int month,
            @RequestParam(defaultValue = "0") int year) {
        LocalDate today = LocalDate.now();
        int m = month > 0 ? month : today.getMonthValue();
        int y = year > 0 ? year : today.getYear();
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(m, y));
    }
}
