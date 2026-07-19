package com.rentease.dto;

import com.rentease.entity.Product;
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
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Product.Category category;
    private BigDecimal pricePerDay;
    private Integer quantity;
    private String imageUrl;
    private Product.Status status;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;

    public static ProductDto fromEntity(Product p) {
        return ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .category(p.getCategory())
                .pricePerDay(p.getPricePerDay())
                .quantity(p.getQuantity())
                .imageUrl(p.getImageUrl())
                .status(p.getStatus())
                .ownerId(p.getOwner().getId())
                .ownerName(p.getOwner().getName())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
