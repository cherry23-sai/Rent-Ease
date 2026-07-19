package com.rentease.service;

import com.rentease.dto.DashboardDto;
import com.rentease.entity.Order;
import com.rentease.entity.Product;
import com.rentease.entity.User;
import com.rentease.repository.OrderRepository;
import com.rentease.repository.ProductRepository;
import com.rentease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public DashboardDto getDashboard(User user) {
        if (user.getRole() == User.Role.SUPER_ADMIN) {
            return buildAdminDashboard();
        } else if (user.getRole() == User.Role.CLIENT) {
            return buildClientDashboard(user);
        } else {
            return buildUserDashboard(user);
        }
    }

    private DashboardDto buildAdminDashboard() {
        long totalUsers = userRepository.count();
        long totalClients = userRepository.findByRole(User.Role.CLIENT).size();
        long pendingApprovals = userRepository.findByStatus(User.Status.PENDING).size();

        return DashboardDto.builder()
                .role("SUPER_ADMIN")
                .totalUsers(totalUsers)
                .totalClients(totalClients)
                .pendingApprovals(pendingApprovals)
                .build();
    }

    private DashboardDto buildClientDashboard(User client) {
        List<Product> myProducts = productRepository.findByOwner(client);
        long available = myProducts.stream().filter(p -> p.getStatus() == Product.Status.AVAILABLE).count();

        List<Order> incoming = orderRepository.findByProduct_OwnerOrderByRequestedAtDesc(client);
        long pending = incoming.stream().filter(o -> o.getStatus() == Order.Status.PENDING).count();

        BigDecimal earnings = incoming.stream()
                .filter(o -> o.getStatus() == Order.Status.APPROVED)
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardDto.builder()
                .role("CLIENT")
                .totalProducts((long) myProducts.size())
                .availableProducts(available)
                .pendingIncomingOrders(pending)
                .totalEarnings(earnings)
                .build();
    }

    private DashboardDto buildUserDashboard(User user) {
        List<Order> myOrders = orderRepository.findByRenterOrderByRequestedAtDesc(user);

        long pending = myOrders.stream().filter(o -> o.getStatus() == Order.Status.PENDING).count();
        long approved = myOrders.stream().filter(o -> o.getStatus() == Order.Status.APPROVED).count();

        BigDecimal spent = myOrders.stream()
                .filter(o -> o.getStatus() == Order.Status.APPROVED)
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardDto.builder()
                .role("USER")
                .pendingOrders(pending)
                .approvedOrders(approved)
                .totalSpent(spent)
                .build();
    }
}
