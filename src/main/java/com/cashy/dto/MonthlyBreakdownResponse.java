package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyBreakdownResponse {

    private Integer year;
    private Integer month;
    private Double income;
    private Double expenses;
}
