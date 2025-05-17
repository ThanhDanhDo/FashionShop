package com.example.fashionshop.repository;

import com.example.fashionshop.enums.OrderStatus;
import com.example.fashionshop.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findById(Long orderId);
    List<Order> findByUserId(Long userId);
//    Optional<Order> findByOrderId(Long orderId);

    Page<Order> findAll(Pageable pageable);
    Page<Order> findByUserId(Long userId, Pageable pageable);
    Page<Order> findByOrderStatus(OrderStatus orderStatus, Pageable pageable);
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
