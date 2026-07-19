package com.rentease.controller;

import com.rentease.dto.ChangePasswordRequest;
import com.rentease.dto.ProfileDto;
import com.rentease.dto.ProfileUpdateRequest;
import com.rentease.entity.User;
import com.rentease.service.CurrentUserService;
import com.rentease.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public ProfileDto getProfile() {
        return profileService.getProfile(currentUserService.getCurrentUser());
    }

    @PutMapping
    public ProfileDto updateProfile(@RequestBody ProfileUpdateRequest req) {
        return profileService.updateProfile(currentUserService.getCurrentUser(), req);
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest req) {
        profileService.changePassword(currentUserService.getCurrentUser(), req);
        return ResponseEntity.ok("Password updated successfully");
    }
}
