package com.example.fashionshop.controller;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.service.InteractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("")
    public ResponseEntity<List<Product>> getInteractToRecommendation(Authentication authentication) throws Exception {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        List<Product> recommend = interactService.getInteractToRecommendation(user);

        return ResponseEntity.ok(recommend);
    }

}