package com.rentease.controller;

import com.rentease.dto.*;
import com.rentease.entity.User;
import com.rentease.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest req) {
        authService.registerUser(req, User.Role.USER);
        return ResponseEntity.ok("User registered. Awaiting approval.");
    }

    @PostMapping("/register/client")
    public ResponseEntity<?> registerClient(@RequestBody RegisterRequest req) {
        authService.registerUser(req, User.Role.CLIENT);
        return ResponseEntity.ok("Client registered. Awaiting approval.");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
