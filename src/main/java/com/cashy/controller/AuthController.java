package com.cashy.controller;

import com.cashy.dto.AuthResponse;
import com.cashy.dto.LoginRequest;
import com.cashy.dto.RegisterRequest;
import com.cashy.entity.User;
import com.cashy.service.JwtService;
import com.cashy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.cashy.util.Constant.*;

@RestController
@RequestMapping(AUTH_PATH)
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping(REGISTER_PATH)
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        User user = userService.register(request.getEmail(), request.getUsername(), request.getPassword());
        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping(LOGIN_PATH)
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = jwtService.generateToken(request.getEmail());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
