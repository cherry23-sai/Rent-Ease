package com.rentease.dto;

import com.rentease.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal pricePerDay;
    private Long renterId;
    private String renterName;
    private Long ownerId;
    private String ownerName;
    private Integer quantity;
    private Integer rentalDays;
    private BigDecimal totalPrice;
    private Order.Status status;
    private LocalDateTime requestedAt;
    private LocalDateTime respondedAt;

    public static OrderDto fromEntity(Order o) {
        return OrderDto.builder()
                .id(o.getId())
                .productId(o.getProduct().getId())
                .productName(o.getProduct().getName())
                .productImageUrl(o.getProduct().getImageUrl())
                .pricePerDay(o.getProduct().getPricePerDay())
                .renterId(o.getRenter().getId())
                .renterName(o.getRenter().getName())
                .ownerId(o.getProduct().getOwner().getId())
                .ownerName(o.getProduct().getOwner().getName())
                .quantity(o.getQuantity())
                .rentalDays(o.getRentalDays())
                .totalPrice(o.getTotalPrice())
                .status(o.getStatus())
                .requestedAt(o.getRequestedAt())
                .respondedAt(o.getRespondedAt())
                .build();
    }
}
