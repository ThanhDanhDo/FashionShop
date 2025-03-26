package com.example.fashionshop.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    private CartStatus status;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems;

    public Cart(Long userId, CartStatus status){
        this.userId = userId;
        this.status = status;
        this.cartItems = new ArrayList<>();
    }

    public double calculateTotalPrice() {
        return cartItems.stream()
            .mapToDouble(cartItem -> cartItem.getProduct().getPrice() * cartItem.getQuantity())
            .sum();
    }
}
