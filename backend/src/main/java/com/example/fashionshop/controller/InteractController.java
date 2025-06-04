package com.example.fashionshop.controller;

import com.example.fashionshop.model.Interact;
import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.ProductRepository;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.service.InteractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rec")
@RequiredArgsConstructor
public class InteractController {
    private final InteractService interactService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @PostMapping("/add_interact")
    public ResponseEntity<?> addInteract(@RequestBody Map<String, Object> payload, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Long productId = Long.valueOf(payload.get("productId").toString());
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Not found"));

        Interact interact = interactService.addInteract(user, product);
        return ResponseEntity.ok(interact);
    }

    @GetMapping("")
    public ResponseEntity<List<Product>> getInteractToRecommendation(Authentication authentication) throws Exception {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        List<Product> recommend = interactService.getInteractToRecommendation(user);

        return ResponseEntity.ok(recommend);
    }

}