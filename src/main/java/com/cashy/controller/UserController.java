package com.cashy.controller;

import com.cashy.dto.PasswordUpdateRequest;
import com.cashy.dto.UserResponse;
import com.cashy.dto.UsernameUpdateRequest;
import com.cashy.entity.User;
import com.cashy.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.cashy.util.Constant.*;

@RestController
@RequestMapping(USERS_PATH)
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "View and update the authenticated user's profile")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get the currently authenticated user's profile")
    @GetMapping(ME_PATH)
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(toResponse(userService.getCurrentUser()));
    }

    @Operation(summary = "Update the current user's username")
    @PatchMapping(USERNAME_PATH)
    public ResponseEntity<UserResponse> updateUsername(@Valid @RequestBody UsernameUpdateRequest request) {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(toResponse(userService.updateUsername(user.getId(), request.getNewUsername())));
    }

    @Operation(summary = "Update the current user's password")
    @PatchMapping(PASSWORD_PATH)
    public ResponseEntity<Void> updatePassword(@Valid @RequestBody PasswordUpdateRequest request) {
        User user = userService.getCurrentUser();
        userService.updatePassword(user.getId(), request.getCurrentPassword(), request.getNewPassword());
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
