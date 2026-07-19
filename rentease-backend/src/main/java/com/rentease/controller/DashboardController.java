package com.rentease.controller;

import com.rentease.dto.DashboardDto;
import com.rentease.service.CurrentUserService;
import com.rentease.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public DashboardDto getDashboard() {
        return dashboardService.getDashboard(currentUserService.getCurrentUser());
    }
}
