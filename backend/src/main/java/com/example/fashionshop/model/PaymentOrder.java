package com.example.fashionshop.model;

import com.example.fashionshop.enums.PaymentOrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private double amount;

    @Enumerated(EnumType.STRING)
    private PaymentOrderStatus status = PaymentOrderStatus.PENDING;

    private String paymentLinkId;

    @ManyToOne
    private User user;

    @OneToOne(cascade = CascadeType.ALL)
    private Order order;

}
