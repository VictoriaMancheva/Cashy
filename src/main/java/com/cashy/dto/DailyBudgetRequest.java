package com.cashy.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DailyBudgetRequest {

    @NotNull
    @Positive
    private Double dailyLimit;

    private LocalDate date;
}
