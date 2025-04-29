package com.example.fashionshop.repository;

import com.example.fashionshop.model.Wishlist;
import com.example.fashionshop.model.User;
import com.example.fashionshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
    
    @Query(value = """
    SELECT p.id AS productId, p.name AS productName, COUNT(w.id) AS wishlistCount
    FROM wishlist w
    JOIN product p ON w.product_id = p.id
    GROUP BY p.id, p.name
    ORDER BY wishlistCount DESC
    LIMIT :limit
    """, nativeQuery = true)
    List<Map<String, Object>> findTopWishlistProducts(@Param("limit") int limit);
}
