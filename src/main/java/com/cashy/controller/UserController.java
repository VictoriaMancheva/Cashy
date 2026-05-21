package com.cashy.controller;

import com.cashy.dto.PasswordUpdateRequest;
import com.cashy.dto.UserResponse;
import com.cashy.dto.UsernameUpdateRequest;
import com.cashy.entity.User;
import com.cashy.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(toResponse(userService.getCurrentUser()));
    }

    @PatchMapping("/me/username")
    public ResponseEntity<UserResponse> updateUsername(@Valid @RequestBody UsernameUpdateRequest request) {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(toResponse(userService.updateUsername(user.getId(), request.getNewUsername())));
    }

    @PatchMapping("/me/password")
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
