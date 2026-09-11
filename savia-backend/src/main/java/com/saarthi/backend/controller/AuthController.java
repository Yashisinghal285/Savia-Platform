package com.saarthi.backend.controller;

import com.saarthi.backend.dto.LoginRequest;
import com.saarthi.backend.dto.LoginResponse;
import com.saarthi.backend.dto.RegisterRequest;
import com.saarthi.backend.entity.User;
import com.saarthi.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication", description = "User registration and JWT login authentication")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Register a new user account", description = "Creates a new Guardian, Caregiver, Therapist, or Admin user account.")
    @PostMapping("/register")
    public ResponseEntity<User> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = authService.register(request);

        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Log in with email and password", description = "Authenticates user credentials and returns a JWT Bearer token.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }
}