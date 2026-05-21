package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BudgetResponse {

    private Long id;
    private Double totalAmount;
    private Integer month;
    private Integer year;
    private List<BudgetCategoryResponse> categories;
}
