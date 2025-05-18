package com.example.fashionshop.repository;

import com.example.fashionshop.model.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {
    PaymentOrder findByPaymentLinkId(String paymentLinkId);
    PaymentOrder findByOrderId(Long orderId);
}
