package com.example.fashionshop.controller;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.Recommendation;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.service.RecommendationService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.fashionshop.model.Address;
import com.example.fashionshop.repository.AddressRepository;
import com.example.fashionshop.request.ChangePasswordRequest;
import com.example.fashionshop.response.ApiResponse;
import com.example.fashionshop.service.AddressService;
import com.example.fashionshop.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


import java.util.*;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {
    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    @GetMapping("")
    public ResponseEntity<List<Product>> getRecommendations(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    
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
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/searchRecommendation")
    public ResponseEntity<?> searchRecommendations(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Recommendation> recPage = recommendationService.searchRecommendation(id, userId, pageable);

        List<Map<String, Object>> recList = recPage.getContent().stream().map(rec -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", rec.getId());
            map.put("userId", rec.getUserId());
            map.put("productIds", rec.getProductIds());
            return map;
        }).toList();

        return ResponseEntity.ok(java.util.Map.of(
                "content", recList,
                "totalElements", recPage.getTotalElements(),
                "number", recPage.getNumber(),
                "size", recPage.getSize()
        ));
    }

}
