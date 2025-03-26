package com.example.fashionshop.controller;

import com.example.fashionshop.enums.CartStatus;
import com.example.fashionshop.model.Cart;
import com.example.fashionshop.model.CartItem;
import com.example.fashionshop.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return Long.parseLong(authentication.getName()); // Assumes username is userId
    }

    private boolean hasRole(String role) {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
               .stream()
               .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(role));
    }
    

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    @GetMapping("/{cartId}")
    public ResponseEntity<Cart> getCartById(@PathVariable Long cartId) {
        Long userId = getCurrentUserId();
        Optional<Cart> cart = cartService.getCartById(cartId);
    
        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
    
        // Allow ADMIN to view any cart
        if (hasRole("ADMIN") || cart.get().getUserId().equals(userId)) {
            return ResponseEntity.ok(cart.get());
        }
    
        return ResponseEntity.status(403).build(); // 403 Forbidden
    }
    
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    @GetMapping("/{cartId}/items")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        Long userId = getCurrentUserId();
        Optional<Cart> cart = cartService.getCartById(cartId);
    
        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
    
        if (hasRole("ADMIN") || cart.get().getUserId().equals(userId)) {
            return ResponseEntity.ok(cartService.getCartItems(cartId));
        }
    
        return ResponseEntity.status(403).build();
    }
    

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping
    public ResponseEntity<Cart> createCart() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(cartService.createCart(userId));
    }

    @PreAuthorize("hasAuthority('USER')")
    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long cartId) {
        Long userId = getCurrentUserId();
        Optional<Cart> cart = cartService.getCartById(cartId);

        if (cart.isEmpty() || !cart.get().getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        cartService.clearCart(cartId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long cartId) {
        Long userId = getCurrentUserId();
        Optional<Cart> cart = cartService.getCartById(cartId);

        if (cart.isEmpty() || !cart.get().getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        cartService.deleteCart(cartId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    @PutMapping("/{cartId}/status")
    public ResponseEntity<Cart> updateStatusCart(@PathVariable Long cartId, @RequestParam CartStatus status) {
        Long userId = getCurrentUserId();
        Optional<Cart> cart = cartService.getCartById(cartId);

        if (cart.isEmpty() || !cart.get().getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok().build();
    }
}
