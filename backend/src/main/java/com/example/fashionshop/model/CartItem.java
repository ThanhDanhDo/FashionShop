package com.example.fashionshop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cart_item")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonIgnore
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String size;

    private String color;

    private int quantity;

    private double totalPrice;

    public CartItem(Cart cart, Product product, String size, int quantity) {
        this.cart = cart;
        this.product = product;
        this.size = size;
        this.quantity = quantity;
        this.totalPrice = product.getPrice() * quantity;
    }
}