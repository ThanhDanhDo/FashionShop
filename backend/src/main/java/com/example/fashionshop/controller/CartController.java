package com.example.fashionshop.controller;

import com.example.fashionshop.enums.CartStatus;
import com.example.fashionshop.model.Cart;
import com.example.fashionshop.model.CartItem;
import com.example.fashionshop.service.CartService;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{cartId}")
    public ResponseEntity<Cart> getCartById(@PathVariable Long cartId) {
        Long userId = getCurrentUserId();
        Optional<Cart> cart = cartService.getCartById(cartId);

        if (cart.isEmpty() || !cart.get().getUserId().equals(userId)) {
            return ResponseEntity.status(403).build(); // 403 Forbidden if not the owner
        }

        return ResponseEntity.ok(cart.get());
    }

    @GetMapping("/{cartId}/items")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        Long userId = getCurrentUserId();
        Optional<Cart> cart = cartService.getCartById(cartId);

        if (cart.isEmpty() || !cart.get().getUserId().equals(userId)) {
            return ResponseEntity.status(403).build(); // 403 Forbidden if not the owner
        }

        return ResponseEntity.ok(cartService.getCartItems(cartId));
    }

    @PostMapping
    public ResponseEntity<Cart> createCart() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(cartService.createCart(userId));
    }

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

    @PutMapping("/{cartId}/status")
    public ResponseEntity<Cart> updateStatusCart(@PathVariable Long cartId, @RequestParam CartStatus status) {
        Long userId = getCurrentUserId();
        Optional<Cart> cart = cartService.getCartById(cartId);

        if (cart.isEmpty() || !cart.get().getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(cartService.updateStatusCart(cartId, status));
    }
}
