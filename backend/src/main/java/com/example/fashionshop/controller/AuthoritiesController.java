package com.example.fashionshop.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthoritiesController {

    @GetMapping("/authorities")
    public ResponseEntity<?> getAuthorities(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "User is not authenticated",
                    "status", HttpStatus.UNAUTHORIZED.value()
            ));
        }
        String email = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        return ResponseEntity.ok(Map.of(
                "email", email,
                "role", authorities.stream().map(GrantedAuthority::getAuthority).toList()
        ));
    }
}