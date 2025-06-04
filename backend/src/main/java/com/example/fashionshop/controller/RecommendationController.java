package com.example.fashionshop.controller;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {
    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    @GetMapping("")
    public ResponseEntity<List<Product>> getRecommendations(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        List<Product> recommendations = recommendationService.findRecommendationByUserId(user);
        return ResponseEntity.ok(recommendations);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/start_training")
    public ResponseEntity<String> startTraining() {
        recommendationService.triggerTraining();
        return ResponseEntity.ok("Training triggered successfully");
    }
}
