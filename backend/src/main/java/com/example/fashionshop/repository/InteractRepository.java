package com.example.fashionshop.repository;

import com.example.fashionshop.model.Interact;
import com.example.fashionshop.model.Recommendation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InteractRepository extends JpaRepository<Interact, Long> {
    Optional<Interact> findByUserIdAndProductId(Integer userId, Long productId);
    List<Interact> findAllByUserId(int userId);
    Page<Interact> findById(Long id, Pageable pageable);
    Page<Interact> findByUserId(Integer userId, Pageable pageable);
    Page<Interact> findByProductId(Long productId, Pageable pageable);
}
