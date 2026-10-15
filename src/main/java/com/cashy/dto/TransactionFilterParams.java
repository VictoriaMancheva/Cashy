package com.cashy.dto;

import com.cashy.entity.Transaction;

import java.time.LocalDate;

public record TransactionFilterParams(
        Transaction.TransactionType type,
        LocalDate from,
        LocalDate to,
        Long categoryId,
        Long paymentMethodId,
        Double minAmount,
        Double maxAmount,
        String search
) {}
