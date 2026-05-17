package com.cashy.dto;

import com.cashy.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TransactionResponse {

    private Long id;
    private Double amount;
    private Transaction.TransactionType type;
    private String description;
    private LocalDate date;
    private String receiptImage;
    private Long categoryId;
    private String categoryName;
    private Long paymentMethodId;
    private String paymentMethodName;
}
