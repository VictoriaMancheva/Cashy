package com.cashy.dto;

import com.cashy.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private Double amount;
    private String currency;
    private Payment.PaymentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
}
