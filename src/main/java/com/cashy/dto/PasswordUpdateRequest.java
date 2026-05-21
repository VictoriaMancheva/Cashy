package com.cashy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordUpdateRequest {

    @NotBlank
    private String currentPassword;

    @NotBlank
    @Size(min = 6, message = "must be at least 6 characters")
    private String newPassword;
}
