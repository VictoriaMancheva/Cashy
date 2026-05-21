package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DailyBudgetResponse {

    private Long id;
    private Double dailyLimit;
    private LocalDate date;
}
