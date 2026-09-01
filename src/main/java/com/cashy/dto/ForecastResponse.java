package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ForecastResponse {
    private Integer forecastMonth;
    private Integer forecastYear;
    private Double forecastIncome;
    private Double forecastExpenses;
    private Double forecastNet;
}
