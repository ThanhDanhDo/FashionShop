package com.example.fashionshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.fashionshop.enums.CartStatus;
import com.example.fashionshop.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long>{
    Optional<Cart> findByUserIdAndStatus(Long userId, CartStatus cartStatus);

    Cart findByUserId(Long userId);
}
