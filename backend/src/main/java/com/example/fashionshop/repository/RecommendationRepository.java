package com.example.fashionshop.repository;

import com.example.fashionshop.model.Recommendation;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    Optional<Recommendation> findByUserId(int userId);
}
