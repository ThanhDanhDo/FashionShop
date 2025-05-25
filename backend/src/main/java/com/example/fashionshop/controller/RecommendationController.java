package com.example.fashionshop.controller;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
}
