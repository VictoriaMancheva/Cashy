package com.cashy.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BudgetCategoryRequest {

    @NotNull
    private Long categoryId;

    @NotNull
    @Positive
    private Double limitAmount;
}
