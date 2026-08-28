package com.cashy.controller;

import com.cashy.dto.DashboardSummaryResponse;
import com.cashy.service.DashboardService;
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
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping(SUMMARY_PATH)
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }
}
