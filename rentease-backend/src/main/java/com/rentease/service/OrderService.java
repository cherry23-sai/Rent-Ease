package com.rentease.service;

import com.rentease.dto.OrderDto;
import com.rentease.dto.OrderRequest;
import com.rentease.entity.Order;
import com.rentease.entity.Product;
import com.rentease.entity.User;
import com.rentease.exception.ResourceNotFoundException;
import com.rentease.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final AuditLogService auditLogService;

    public OrderDto createOrder(User renter, OrderRequest req) {
        Product product = productService.findEntity(req.getProductId());

        if (product.getOwner().getId().equals(renter.getId())) {
            throw new RuntimeException("You cannot rent your own product");
        }

        if (product.getStatus() != Product.Status.AVAILABLE) {
            throw new RuntimeException("Product is not available for rent");
        }

        if (req.getQuantity() == null || req.getQuantity() < 1) {
            throw new RuntimeException("Quantity must be at least 1");
        }

        if (req.getRentalDays() == null || req.getRentalDays() < 1) {
            throw new RuntimeException("Rental days must be at least 1");
        }

        if (product.getQuantity() < req.getQuantity()) {
            throw new RuntimeException("Only " + product.getQuantity() + " unit(s) available");
        }

        BigDecimal totalPrice = product.getPricePerDay()
                .multiply(BigDecimal.valueOf(req.getQuantity()))
                .multiply(BigDecimal.valueOf(req.getRentalDays()));

        Order order = Order.builder()
                .product(product)
                .renter(renter)
                .quantity(req.getQuantity())
                .rentalDays(req.getRentalDays())
                .totalPrice(totalPrice)
                .status(Order.Status.PENDING)
                .build();

        return OrderDto.fromEntity(orderRepository.save(order));
    }

    public List<OrderDto> getMyOrders(User renter) {
        return orderRepository.findByRenterOrderByRequestedAtDesc(renter).stream()
                .map(OrderDto::fromEntity)
                .toList();
    }

    public List<OrderDto> getIncomingOrders(User owner) {
        return orderRepository.findByProduct_OwnerOrderByRequestedAtDesc(owner).stream()
                .map(OrderDto::fromEntity)
                .toList();
    }

    public OrderDto approveOrder(Long orderId, User owner) {
        Order order = findEntity(orderId);
        assertOwnership(order, owner);
        assertPending(order);

        Product product = order.getProduct();
        if (product.getQuantity() < order.getQuantity()) {
            throw new RuntimeException("Not enough stock left to approve this request");
        }

        product.setQuantity(product.getQuantity() - order.getQuantity());
        if (product.getQuantity() == 0) {
            product.setStatus(Product.Status.UNAVAILABLE);
        }
        productService.save(product);

        order.setStatus(Order.Status.APPROVED);
        order.setRespondedAt(LocalDateTime.now());
        orderRepository.save(order);

        auditLogService.log("ORDER_APPROVED", owner, "Order", order.getId(),
                "Approved rental of " + product.getName());

        return OrderDto.fromEntity(order);
    }

    public OrderDto rejectOrder(Long orderId, User owner) {
        Order order = findEntity(orderId);
        assertOwnership(order, owner);
        assertPending(order);

        order.setStatus(Order.Status.REJECTED);
        order.setRespondedAt(LocalDateTime.now());
        orderRepository.save(order);

        auditLogService.log("ORDER_REJECTED", owner, "Order", order.getId(),
                "Rejected rental of " + order.getProduct().getName());

        return OrderDto.fromEntity(order);
    }

    public OrderDto cancelOrder(Long orderId, User renter) {
        Order order = findEntity(orderId);

        if (!order.getRenter().getId().equals(renter.getId())) {
            throw new RuntimeException("This is not your order");
        }
        assertPending(order);

        order.setStatus(Order.Status.CANCELLED);
        order.setRespondedAt(LocalDateTime.now());
        orderRepository.save(order);

        return OrderDto.fromEntity(order);
    }

    private Order findEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    private void assertOwnership(Order order, User owner) {
        if (!order.getProduct().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("This request is not for one of your products");
        }
    }

    private void assertPending(Order order) {
        if (order.getStatus() != Order.Status.PENDING) {
            throw new RuntimeException("Only pending requests can be updated");
        }
    }
}
