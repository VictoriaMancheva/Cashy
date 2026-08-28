package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryBreakdownResponse {

    private Long categoryId;
    private String categoryName;
    private Double amount;
}
