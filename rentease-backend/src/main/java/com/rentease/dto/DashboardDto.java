package com.rentease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    private String role;

    // SUPER_ADMIN
    private Long totalUsers;
    private Long totalClients;
    private Long pendingApprovals;

    // CLIENT
    private Long totalProducts;
    private Long availableProducts;
    private Long pendingIncomingOrders;
    private BigDecimal totalEarnings;

    // USER
    private Long pendingOrders;
    private Long approvedOrders;
    private BigDecimal totalSpent;
}
