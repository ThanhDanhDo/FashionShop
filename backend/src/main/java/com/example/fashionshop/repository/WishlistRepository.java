package com.example.fashionshop.repository;

import com.example.fashionshop.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
//    Wishlist findByUserId(Long userId);

    Optional<Wishlist> findByUserId(Long userId);
}
