package com.rentease.controller;

import com.rentease.dto.OrderDto;
import com.rentease.dto.OrderRequest;
import com.rentease.entity.User;
import com.rentease.service.CurrentUserService;
import com.rentease.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final CurrentUserService currentUserService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderRequest req) {
        User renter = currentUserService.getCurrentUser();
        return ResponseEntity.ok(orderService.createOrder(renter, req));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public List<OrderDto> getMyOrders() {
        User renter = currentUserService.getCurrentUser();
        return orderService.getMyOrders(renter);
    }

    @GetMapping("/incoming")
    @PreAuthorize("hasRole('CLIENT')")
    public List<OrderDto> getIncomingOrders() {
        User owner = currentUserService.getCurrentUser();
        return orderService.getIncomingOrders(owner);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<OrderDto> approve(@PathVariable Long id) {
        User owner = currentUserService.getCurrentUser();
        return ResponseEntity.ok(orderService.approveOrder(id, owner));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<OrderDto> reject(@PathVariable Long id) {
        User owner = currentUserService.getCurrentUser();
        return ResponseEntity.ok(orderService.rejectOrder(id, owner));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderDto> cancel(@PathVariable Long id) {
        User renter = currentUserService.getCurrentUser();
        return ResponseEntity.ok(orderService.cancelOrder(id, renter));
    }
}
