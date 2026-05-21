package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class GoalResponse {

    private Long id;
    private String name;
    private Double targetAmount;
    private Double currentAmount;
    private LocalDate deadline;
    private Double progressPercent;
}
