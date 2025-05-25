package com.example.fashionshop.service;

import org.springframework.stereotype.Service;

import com.example.fashionshop.config.ColabConfig;
import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.Recommendation;
import com.example.fashionshop.repository.RecommendationRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;

import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;
    private final RestTemplate restTemplate;
    private final ColabConfig colabConfig;

    public void triggerTraining() {
        String endpoint = colabConfig.getNgrok_link() + "update_recommendation";

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

    public List<Product> findRecommendationByUserId(int userId) {
        return recommendationRepository.findByUserId(userId)
                .map(Recommendation::getProducts)
                .orElse(List.of());
    }
}