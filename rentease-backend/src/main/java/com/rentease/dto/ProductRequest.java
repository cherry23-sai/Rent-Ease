package com.rentease.dto;

import com.rentease.entity.Product;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Product.Category category;
    private BigDecimal pricePerDay;
    private Integer quantity;
    private String imageUrl;
}
