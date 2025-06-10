package com.example.fashionshop.repository;

import com.example.fashionshop.enums.OrderStatus;
import com.example.fashionshop.enums.PaymentStatus;
import com.example.fashionshop.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findById(Long orderId);
    List<Order> findByUserId(Long userId);

    Page<Order> findAll(Pageable pageable);
    Page<Order> findByUserId(Long userId, Pageable pageable);
    Page<Order> findByOrderStatus(OrderStatus orderStatus, Pageable pageable);
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(o) FROM Order o")
    int countAllOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderStatus = 'CANCELLED'")
    int countCanceledOrders();

    @Query("SELECT o FROM Order o WHERE o.orderStatus = 'CANCELLED'")
    List<Order> findCanceledOrders();

    @Query("SELECT COALESCE(SUM(o.totalOrderPrice), 0) FROM Order o WHERE o.paymentStatus = 'COMPLETED'")
    double sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalOrderPrice), 0) FROM Order o WHERE o.orderStatus = 'CANCELLED'")
    double sumTotalRefunds();

    Optional<Order> findByPaymentString(String paymentString);
    Page<Order> findById(Long id, Pageable pageable);
    Page<Order> findByAddressId(Long addressId, Pageable pageable);
    Page<Order> findByOrderItems_Product_Id(Long productId, Pageable pageable);
    Page<Order> findByOrderDateBetween(LocalDateTime from, LocalDateTime to, Pageable pageable);
    Page<Order> findByPaymentStatus(PaymentStatus status, Pageable pageable);
    Page<Order> findByOrderStatusAndPaymentStatus(OrderStatus status, PaymentStatus paymentStatus, Pageable pageable);

    // Thêm các phương thức mới để hỗ trợ tìm kiếm kết hợp
    Page<Order> findByOrderStatusAndOrderDateBetween(OrderStatus orderStatus, LocalDateTime from, LocalDateTime to, Pageable pageable);
    Page<Order> findByPaymentStatusAndOrderDateBetween(PaymentStatus paymentStatus, LocalDateTime from, LocalDateTime to, Pageable pageable);
    Page<Order> findByOrderStatusAndPaymentStatusAndOrderDateBetween(OrderStatus orderStatus, PaymentStatus paymentStatus, LocalDateTime from, LocalDateTime to, Pageable pageable);
}