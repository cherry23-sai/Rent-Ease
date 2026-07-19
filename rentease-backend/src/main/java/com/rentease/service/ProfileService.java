package com.rentease.service;

import com.rentease.dto.ChangePasswordRequest;
import com.rentease.dto.ProfileDto;
import com.rentease.dto.ProfileUpdateRequest;
import com.rentease.entity.User;
import com.rentease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileDto getProfile(User user) {
        return ProfileDto.fromEntity(user);
    }

    public ProfileDto updateProfile(User user, ProfileUpdateRequest req) {
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        user.setAddress(req.getAddress());
        userRepository.save(user);
        return ProfileDto.fromEntity(user);
    }

    public void changePassword(User user, ChangePasswordRequest req) {
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        if (req.getNewPassword() == null || req.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
