package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TodayBudgetResponse {

    public enum Source {
        MANUAL, CALCULATED, NONE
    }

    private LocalDate date;
    private Double dailyLimit;
    private Double spentToday;
    private Double remainingToday;
    private Source source;
}
