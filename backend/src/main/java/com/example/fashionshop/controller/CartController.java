package com.example.fashionshop.controller;

import com.example.fashionshop.enums.CartStatus;
import com.example.fashionshop.model.Cart;
import com.example.fashionshop.model.CartItem;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.repository.CartItemRepository;
import com.example.fashionshop.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    public CartController(CartService cartService, UserRepository userRepository, CartItemRepository cartItemRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user.getId();
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
    
    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/{cartId}/items")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        Long userId = getCurrentUserId();
        Cart cart = cartService.getCartById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Kiểm tra quyền truy cập
        if (!cart.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        // Lấy danh sách cart items với đầy đủ thông tin product
        List<CartItem> items = cartItemRepository.findByCartId(cartId);
        return ResponseEntity.ok(items);
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

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/active")
    public ResponseEntity<Cart> getActiveCart() {
        try {
            Long userId = getCurrentUserId();
            Cart activeCart = cartService.getActiveCart(userId);
            return ResponseEntity.ok(activeCart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
