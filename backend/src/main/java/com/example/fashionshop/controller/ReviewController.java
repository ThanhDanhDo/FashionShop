package com.example.fashionshop.controller;

import com.example.fashionshop.model.Review;
import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.enums.Role;
import com.example.fashionshop.service.ReviewService;
import com.example.fashionshop.repository.ProductRepository;
import com.example.fashionshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        Review saved = reviewService.createReview(review);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long reviewId,
            @RequestParam Long userId,
            @RequestBody Review updatedReview
    ) {
        Review existingReview = reviewService.getReviewById(reviewId);
        if (existingReview == null) {
            return ResponseEntity.notFound().build();
        }

        User user = userRepository.findById(userId).orElse(null);

        if (!existingReview.getUser().getId().equals(userId) && (user == null || user.getRole() != Role.ADMIN)) {
            return ResponseEntity.status(403).build();
        }

        Review savedReview = reviewService.updateReview(existingReview, updatedReview);
        return ResponseEntity.ok(savedReview);
    }


    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }


    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @RequestParam Long userId
    ) {
        Review review = reviewService.getReviewById(reviewId);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }

        User user = userRepository.findById(userId).orElse(null);

        if (!review.getUser().getId().equals(userId) && (user == null || user.getRole() != Role.ADMIN)) {
            return ResponseEntity.status(403).build();
        }

        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        Double avg = reviewService.getAverageRating(productId);
        return ResponseEntity.ok(avg != null ? avg : 0.0);
    }
}
