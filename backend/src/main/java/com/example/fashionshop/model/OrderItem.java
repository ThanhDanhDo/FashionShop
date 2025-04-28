package com.example.fashionshop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_item")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;

    private String size;

    private String color;

    private double totalPrice;

    public OrderItem(Order order, Product product, int quantity, String size, String color) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.size = size;
        this.color = color;
        this.totalPrice = (product != null && product.getPrice() != null) ? product.getPrice() * quantity : 0.0;
    }

}
