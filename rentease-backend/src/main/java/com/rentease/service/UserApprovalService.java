package com.rentease.service;

import com.rentease.entity.User;
import com.rentease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserApprovalService {

    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public List<User> getPendingUsers() {
        return userRepository.findByStatus(User.Status.PENDING);
    }

    public void approveUser(Long userId, User admin) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(User.Status.APPROVED);
        user.setActive(true);
        user.setApprovedAt(LocalDateTime.now());
        user.setApprovedBy(admin.getId());

        userRepository.save(user);
        auditLogService.log("USER_APPROVED", admin, "User", user.getId(), "Approved " + user.getEmail());
    }

    public void rejectUser(Long userId, User admin) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(User.Status.REJECTED);
        user.setActive(false);

        userRepository.save(user);
        auditLogService.log("USER_REJECTED", admin, "User", user.getId(), "Rejected " + user.getEmail());
    }
}
