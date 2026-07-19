package com.rentease.service;

import com.rentease.dto.ProductDto;
import com.rentease.dto.ProductRequest;
import com.rentease.entity.Product;
import com.rentease.entity.User;
import com.rentease.exception.ResourceNotFoundException;
import com.rentease.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDto> getAvailableProducts(String search, Product.Category category) {
        List<Product> products;

        if (search != null && !search.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCaseAndStatus(search, Product.Status.AVAILABLE);
        } else if (category != null) {
            products = productRepository.findByCategoryAndStatus(category, Product.Status.AVAILABLE);
        } else {
            products = productRepository.findByStatus(Product.Status.AVAILABLE);
        }

        return products.stream().map(ProductDto::fromEntity).toList();
    }

    public ProductDto getById(Long id) {
        return ProductDto.fromEntity(findEntity(id));
    }

    public List<ProductDto> getMyProducts(User owner) {
        return productRepository.findByOwner(owner).stream()
                .map(ProductDto::fromEntity)
                .toList();
    }

    public ProductDto createProduct(User owner, ProductRequest req) {
        Product product = Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .category(req.getCategory())
                .pricePerDay(req.getPricePerDay())
                .quantity(req.getQuantity())
                .imageUrl(req.getImageUrl())
                .status(Product.Status.AVAILABLE)
                .owner(owner)
                .build();

        return ProductDto.fromEntity(productRepository.save(product));
    }

    public ProductDto updateProduct(Long id, User owner, ProductRequest req) {
        Product product = findEntity(id);
        assertOwnership(product, owner);

        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setCategory(req.getCategory());
        product.setPricePerDay(req.getPricePerDay());
        product.setQuantity(req.getQuantity());
        product.setImageUrl(req.getImageUrl());

        return ProductDto.fromEntity(productRepository.save(product));
    }

    public void deleteProduct(Long id, User owner) {
        Product product = findEntity(id);
        assertOwnership(product, owner);
        productRepository.delete(product);
    }

    public ProductDto setStatus(Long id, User owner, Product.Status status) {
        Product product = findEntity(id);
        assertOwnership(product, owner);
        product.setStatus(status);
        return ProductDto.fromEntity(productRepository.save(product));
    }

    // package-private so OrderService can reuse the same lookup/adjustment logic
    Product findEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    void save(Product product) {
        productRepository.save(product);
    }

    private void assertOwnership(Product product, User owner) {
        if (!product.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You do not own this product");
        }
    }
}
