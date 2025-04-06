package com.example.fashionshop.repository;

import com.example.fashionshop.model.Cart;
import com.example.fashionshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.fashionshop.model.CartItem;

import java.util.Optional;
import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long>{
    Optional<CartItem> findByCartIdAndProductId (Long cartId, Long ProductId);
    List<CartItem> findByCartId(Long cartId);
    void deleteByCartId(Long cartId);

    Optional<CartItem> findById(Long id);
    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}
