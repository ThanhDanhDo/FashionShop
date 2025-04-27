package com.example.fashionshop.repository;

import com.example.fashionshop.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findAllByOrderId(Long orderId);
    Optional<OrderItem> findById(Long orderItemId);
}
