package com.example.fashionshop.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonIgnoreProperties({"cartItems"})
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;

    private String size;
    
    private String color;

    private double totalPrice;

    public CartItem(Cart cart, Product product, int quantity, String size, String color) {
        this.cart = cart;
        this.product = product;
        this.size = size;
        this.color = color;
        setQuantity(quantity);
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
        this.totalPrice = (product != null && product.getPrice() != null) 
            ? product.getPrice() * quantity 
            : 0.0;
    }
}
