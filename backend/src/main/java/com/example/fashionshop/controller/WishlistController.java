package com.example.fashionshop.controller;

import com.example.fashionshop.model.Wishlist;
import com.example.fashionshop.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/add")
    public ResponseEntity<Wishlist> addToWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(userId, productId));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlistByUser(userId));
    }

    @GetMapping("/top")
    public ResponseEntity<List<Map<String, Object>>> getTopWishlistedProducts(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(wishlistService.getTopWishlistedProducts(limit));
    }
}
