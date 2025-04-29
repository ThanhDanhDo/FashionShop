package com.example.fashionshop.service;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.model.Review;
import com.example.fashionshop.repository.ProductRepository;
import com.example.fashionshop.repository.ReviewRepository;
import com.example.fashionshop.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Review createReview(Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        if (review.getUser() == null || review.getUser().getId() == null ||
            review.getProduct() == null || review.getProduct().getId() == null) {
            throw new IllegalArgumentException("User and Product must be set with IDs");
        }

        User user = userRepository.findById(review.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(review.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        review.setUser(user);
        review.setProduct(product);
        return reviewRepository.save(review);
    }

    public Review updateReview(Review existingReview, Review updatedReview) {
        if (updatedReview.getContent() != null) {
            existingReview.setContent(updatedReview.getContent());
        }
    
        if (updatedReview.getRating() != null) {
            int rating = updatedReview.getRating();
            if (rating < 1 || rating > 5) {
                throw new IllegalArgumentException("Rating must be between 1 and 5");
            }
            existingReview.setRating(rating);
        }
    
        return reviewRepository.save(existingReview);
    }    

    public Review getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId).orElse(null);
    }

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    public Double getAverageRating(Long productId) {
        return reviewRepository.getAverageRatingByProductId(productId);
    }
}
