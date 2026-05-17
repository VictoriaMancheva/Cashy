package com.cashy.dto;

import com.cashy.entity.Transaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TransactionRequest {

    @NotNull
    @Positive
    private Double amount;

    @NotNull
    private Transaction.TransactionType type;

    private String description;
    private LocalDate date;
    private Long categoryId;
    private Long paymentMethodId;
    private String receiptImage;
}
