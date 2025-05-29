package com.example.fashionshop.repository;

import com.example.fashionshop.model.Interact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InteractRepository extends JpaRepository<Interact, Long> {
    Optional<Interact> findByUserIdAndProductId(Integer userId, Long productId);
}
