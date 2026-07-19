package com.rentease.repository;

import com.rentease.entity.Order;
import com.rentease.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByRenterOrderByRequestedAtDesc(User renter);

    List<Order> findByProduct_OwnerOrderByRequestedAtDesc(User owner);

    List<Order> findByStatus(Order.Status status);
}
