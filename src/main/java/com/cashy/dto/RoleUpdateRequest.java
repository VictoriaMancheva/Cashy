package com.cashy.dto;

import com.cashy.entity.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleUpdateRequest {

    @NotNull(message = "Role is required")
    private User.Role role;
}
