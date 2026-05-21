package com.cashy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UsernameUpdateRequest {

    @NotBlank
    private String newUsername;
}
