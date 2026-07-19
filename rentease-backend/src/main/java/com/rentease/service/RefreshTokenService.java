package com.rentease.service;

import com.rentease.entity.RefreshToken;
import com.rentease.entity.User;
import com.rentease.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    // create or replace refresh token for user
    @Transactional
    public RefreshToken createToken(User user) {
        RefreshToken token = refreshTokenRepository.findByUser(user)
                .orElseGet(() -> RefreshToken.builder().user(user).build());

        token.setToken(UUID.randomUUID().toString());
        token.setExpiry(Instant.now().plus(7, ChronoUnit.DAYS)); // 7 days valid

        return refreshTokenRepository.save(token);
    }

    @Transactional
    public RefreshToken validate(String token) {
        RefreshToken rt = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (rt.getExpiry().isBefore(Instant.now())) {
            refreshTokenRepository.delete(rt);
            throw new RuntimeException("Refresh token expired");
        }

        return rt;
    }

    @Transactional
    public void revoke(String token) {
        refreshTokenRepository.findByToken(token)
                .ifPresent(refreshTokenRepository::delete);
    }
}