package com.example.fashionshop.repository;

import com.example.fashionshop.model.Recommendation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    Optional<Recommendation> findByUserId(int userId);
    Page<Recommendation> findByUserId(Integer userId, Pageable pageable);
    Page<Recommendation> findById(Integer id, Pageable pageable);
}
