package com.cashy.controller;

import com.cashy.dto.RoleUpdateRequest;
import com.cashy.dto.UserResponse;
import com.cashy.entity.User;
import com.cashy.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.cashy.util.Constant.ADMIN_PATH;
import static com.cashy.util.Constant.ID_PATH;
import static com.cashy.util.Constant.ROLE_PATH;

@RestController
@RequestMapping(ADMIN_PATH + "/users")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only endpoints for user management")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final UserService userService;

    @Operation(summary = "List all users")
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers().stream().map(this::toResponse).toList());
    }

    @Operation(summary = "Change a user's role")
    @PatchMapping(ROLE_PATH)
    public ResponseEntity<UserResponse> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleUpdateRequest request) {
        return ResponseEntity.ok(toResponse(userService.updateRole(id, request.getRole())));
    }

    @Operation(summary = "Delete a user account")
    @DeleteMapping(ID_PATH)
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}
