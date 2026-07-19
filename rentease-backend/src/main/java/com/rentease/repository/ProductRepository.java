package com.rentease.repository;

import com.rentease.entity.Product;
import com.rentease.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByOwner(User owner);

    List<Product> findByStatus(Product.Status status);

    List<Product> findByCategoryAndStatus(Product.Category category, Product.Status status);

    List<Product> findByNameContainingIgnoreCaseAndStatus(String name, Product.Status status);
}
