package com.rentease.controller;

import com.rentease.dto.ProductDto;
import com.rentease.dto.ProductRequest;
import com.rentease.entity.Product;
import com.rentease.entity.User;
import com.rentease.service.CurrentUserService;
import com.rentease.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<ProductDto> browseProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Product.Category category) {
        return productService.getAvailableProducts(search, category);
    }

    @GetMapping("/{id}")
    public ProductDto getProduct(@PathVariable Long id) {
        return productService.getById(id);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CLIENT')")
    public List<ProductDto> getMyProducts() {
        User owner = currentUserService.getCurrentUser();
        return productService.getMyProducts(owner);
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductRequest req) {
        User owner = currentUserService.getCurrentUser();
        return ResponseEntity.ok(productService.createProduct(owner, req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductRequest req) {
        User owner = currentUserService.getCurrentUser();
        return ResponseEntity.ok(productService.updateProduct(id, owner, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        User owner = currentUserService.getCurrentUser();
        productService.deleteProduct(id, owner);
        return ResponseEntity.ok("Product deleted");
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ProductDto> setStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest req) {
        User owner = currentUserService.getCurrentUser();
        return ResponseEntity.ok(productService.setStatus(id, owner, req.getStatus()));
    }

    public static class StatusUpdateRequest {
        private Product.Status status;

        public Product.Status getStatus() {
            return status;
        }

        public void setStatus(Product.Status status) {
            this.status = status;
        }
    }
}
