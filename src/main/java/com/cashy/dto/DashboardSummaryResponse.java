package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DashboardSummaryResponse {

    private Double totalIncome;
    private Double totalExpenses;
    private Double netBalance;
    private Double currentMonthIncome;
    private Double currentMonthExpenses;
    private List<TransactionResponse> recentTransactions;
}
