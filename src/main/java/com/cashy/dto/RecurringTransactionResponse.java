package com.cashy.dto;

import com.cashy.entity.RecurringTransaction;
import com.cashy.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RecurringTransactionResponse {

    private Long id;
    private Double amount;
    private String description;
    private RecurringTransaction.Frequency frequency;
    private Transaction.TransactionType type;
    private LocalDate nextDate;
    private LocalDateTime createdAt;
    private Long categoryId;
    private String categoryName;
    private Long paymentMethodId;
    private String paymentMethodName;
}
