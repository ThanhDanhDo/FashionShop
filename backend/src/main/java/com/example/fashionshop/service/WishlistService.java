package com.example.fashionshop.service;

import com.example.fashionshop.model.*;
import com.example.fashionshop.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Wishlist addToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        return wishlistRepository.findByUserAndProduct(user, product)
                .orElseGet(() -> wishlistRepository.save(new Wishlist(null, user, product)));
    }

    public void removeFromWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        wishlistRepository.deleteByUserAndProduct(user, product);
    }

    public List<Wishlist> getWishlistByUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return wishlistRepository.findByUser(user);
    }

    public List<Map<String, Object>> getTopWishlistedProducts(int limit) {
        return wishlistRepository.findTopWishlistProducts(limit);
    }
}
