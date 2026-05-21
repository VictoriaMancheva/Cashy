package com.cashy.dto;

import com.cashy.entity.RecurringTransaction;
import com.cashy.entity.Transaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RecurringTransactionRequest {

    @NotNull
    @Positive
    private Double amount;

    private String description;

    @NotNull
    private RecurringTransaction.Frequency frequency;

    @NotNull
    private Transaction.TransactionType type;

    private LocalDate nextDate;

    private Long categoryId;
    private Long paymentMethodId;
}
