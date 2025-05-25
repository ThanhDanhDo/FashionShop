package com.example.fashionshop.controller;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Product>> getRecommendations(@PathVariable int userId) {
        List<Product> recommendations = recommendationService.findRecommendationByUserId(userId);
        return ResponseEntity.ok(recommendations);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/start_training")
    public ResponseEntity<String> startTraining() {
        recommendationService.triggerTraining();
        return ResponseEntity.ok("Training triggered successfully");
    }
}
