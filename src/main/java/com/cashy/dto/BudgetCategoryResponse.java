package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BudgetCategoryResponse {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private Double limitAmount;
    private Double spentAmount;
}
