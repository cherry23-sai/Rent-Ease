package com.rentease.service;

import com.rentease.entity.AuditLog;
import com.rentease.entity.User;
import com.rentease.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(String action, User performedBy, String targetType, Long targetId, String details) {
        AuditLog entry = AuditLog.builder()
                .action(action)
                .performedByEmail(performedBy.getEmail())
                .targetType(targetType)
                .targetId(targetId)
                .details(details)
                .build();

        auditLogRepository.save(entry);
    }
}
