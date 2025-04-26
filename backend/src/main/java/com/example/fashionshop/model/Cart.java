package com.example.fashionshop.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.ArrayList;

import com.example.fashionshop.enums.CartStatus;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name= "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;

    @Enumerated(EnumType.ORDINAL)
    @Column(columnDefinition = "smallint")
    private CartStatus status;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("cart")
    private List<CartItem> cartItems = new ArrayList<>();

    @Column(name = "total_cart_price", nullable = false)
    private double totalCartPrice = 0.0;

    @Column(name = "total_items", nullable = false)
    private int totalItems = 0;

    public Cart(Long userId, CartStatus status){
        this.userId = userId;
        this.status = status;
        this.cartItems = new ArrayList<>();
        this.totalCartPrice = 0.0;
        this.totalItems = 0;
    }

    public double calculateTotalPrice() {
        if (cartItems == null) {
            cartItems = new ArrayList<>();
            return 0.0;
        }
        this.totalCartPrice = cartItems.stream()
            .mapToDouble(cartItem -> cartItem.getProduct().getPrice() * cartItem.getQuantity())
            .sum();
        return this.totalCartPrice;
    }

    public void updateTotalItems() {
        if (cartItems == null) {
            cartItems = new ArrayList<>();
            this.totalItems = 0;
            return;
        }
        this.totalItems = cartItems.stream()
            .mapToInt(CartItem::getQuantity)
            .sum();
    }
}
