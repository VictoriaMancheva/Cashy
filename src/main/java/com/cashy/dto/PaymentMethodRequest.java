package com.cashy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentMethodRequest {

    @NotBlank
    private String name;
}
