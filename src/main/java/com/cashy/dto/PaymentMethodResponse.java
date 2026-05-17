package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentMethodResponse {

    private Long id;
    private String name;
}
