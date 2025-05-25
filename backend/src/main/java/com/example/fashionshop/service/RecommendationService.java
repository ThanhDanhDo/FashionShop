package com.example.fashionshop.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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

    public void triggerTraining(int userId) {
        String colabUrl = "https://xxxxx.ngrok.io/trigger-train";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("userId", userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(colabUrl, HttpMethod.POST, request, String.class);
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