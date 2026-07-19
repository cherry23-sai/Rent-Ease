package com.rentease.controller;

import com.rentease.entity.User;
import com.rentease.service.CurrentUserService;
import com.rentease.service.UserApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final UserApprovalService approvalService;
    private final CurrentUserService currentUserService;

    @GetMapping("/pending")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<User> getPendingRegistrations() {
        return approvalService.getPendingUsers();
    }

    @PostMapping("/approve/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        User admin = currentUserService.getCurrentUser();
        approvalService.approveUser(id, admin);
        return ResponseEntity.ok("User approved successfully");
    }

    @PostMapping("/reject/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        User admin = currentUserService.getCurrentUser();
        approvalService.rejectUser(id, admin);
        return ResponseEntity.ok("User rejected successfully");
    }
}
