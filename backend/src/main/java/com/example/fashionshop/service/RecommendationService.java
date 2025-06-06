package com.example.fashionshop.service;

import org.springframework.stereotype.Service;

import com.example.fashionshop.config.ColabConfig;
import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.model.Recommendation;
import com.example.fashionshop.repository.RecommendationRepository;
import com.example.fashionshop.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.*;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;
    private final ProductRepository productRepository;
    private final RestTemplate restTemplate;
    private final ColabConfig colabConfig;

    public void triggerTraining() {
        String endpoint = colabConfig.getNgrok_link() + "/update_recommendation";

        Map<String, Object> requestBody = new HashMap<>();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, request, String.class);
            System.out.println("Response from Colab: " + response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Product> findRecommendationByUserId(User user) {
        Integer userId = user.getId().intValue();
        Optional<Recommendation> optionalRec = recommendationRepository.findByUserId(userId);
    
        if (optionalRec.isEmpty()) {
            return List.of();
        }
    
        Integer[] productIds = optionalRec.get().getProductIds();
        if (productIds == null || productIds.length == 0) {
            return List.of();
        }

        List<Long> ids = Arrays.stream(productIds)
            .map(Integer::longValue)
            .collect(Collectors.toList());
    
        return productRepository.findAllById(ids);
    }

    public Page<Recommendation> searchRecommendation(Integer id, Integer userId, Pageable pageable) {
        if (id != null) {
            return recommendationRepository.findById(id, pageable);
        }
        if (userId != null) {
            return recommendationRepository.findByUserId(userId, pageable);
        }
        return recommendationRepository.findAll(pageable);
    }    
}