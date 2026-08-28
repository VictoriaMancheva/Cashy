package com.cashy.controller;

import com.cashy.dto.CategoryBreakdownResponse;
import com.cashy.dto.MonthlyBreakdownResponse;
import com.cashy.service.AnalyticsService;
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
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping(MONTHLY_PATH)
    public ResponseEntity<List<MonthlyBreakdownResponse>> getMonthlyBreakdown() {
        return ResponseEntity.ok(analyticsService.getMonthlyBreakdown());
    }

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
