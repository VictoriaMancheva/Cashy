package com.cashy.controller;

import com.cashy.dto.DashboardSummaryResponse;
import com.cashy.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.cashy.util.Constant.DASHBOARDS_PATH;
import static com.cashy.util.Constant.SUMMARY_PATH;

@RestController
@RequestMapping(DASHBOARDS_PATH)
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Aggregated financial summary for the current user")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "Get aggregated financial summary for the current month")
    @GetMapping(SUMMARY_PATH)
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }
}
