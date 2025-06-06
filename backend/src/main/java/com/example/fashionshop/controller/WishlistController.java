package com.example.fashionshop.controller;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.model.Wishlist;
import com.example.fashionshop.repository.ProductRepository;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.repository.WishlistRepository;
import com.example.fashionshop.service.ProductService;
import com.example.fashionshop.service.UserService;
import com.example.fashionshop.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistRepository wishlistRepository;
    private final ProductService productService;
    private final WishlistService wishlistService;
    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("")
    public ResponseEntity<Wishlist> getWishlistByUserId (Authentication authentication) throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Wishlist wishlist = wishlistService.getWishlistByUserId(user);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Wishlist> toggleWishlistItem (Authentication authentication, @PathVariable Long productId) throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Product product = productService.getProductById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        Wishlist updateWishlist = wishlistService.toggleWishlistItem(user, product);
        return ResponseEntity.ok(updateWishlist);
    }
}
