package com.rentease.service;

import com.rentease.dto.LoginRequest;
import com.rentease.dto.LoginResponse;
import com.rentease.dto.RegisterRequest;
import com.rentease.entity.User;
import com.rentease.repository.UserRepository;
import com.rentease.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public void registerUser(RegisterRequest req, User.Role role) {

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .address(req.getAddress())
                .role(role)
                .status(User.Status.PENDING)
                .active(true)
                .build();

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest req) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);
        String refreshToken = refreshTokenService.createToken(user).getToken();

        return LoginResponse.builder()
                .token(token)
                .refreshtoken(refreshToken)
                .role(user.getRole().name())
                .name(user.getName())
                .build();
    }
}
