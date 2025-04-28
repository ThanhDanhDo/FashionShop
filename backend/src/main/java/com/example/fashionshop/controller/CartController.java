package com.example.fashionshop.controller;

import com.example.fashionshop.enums.CartStatus;
import com.example.fashionshop.model.Cart;
import com.example.fashionshop.model.CartItem;
import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.CartRepository;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.request.AddProductRequest;
import com.example.fashionshop.response.ApiResponse;
import com.example.fashionshop.service.CartItemService;
import com.example.fashionshop.service.CartService;
import com.example.fashionshop.service.ProductService;
import com.example.fashionshop.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ProductService productService;
    private final CartItemService cartItemService;
    private final CartRepository cartRepository;

    public CartController(
            CartService cartService,
            UserService userService,
            UserRepository userRepository,
            ProductService productService,
            CartItemService cartItemService,
            CartRepository cartRepository) {
        this.cartService = cartService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.productService = productService;
        this.cartItemService = cartItemService;
        this.cartRepository = cartRepository;
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
    public ResponseEntity<Cart> getCartById(Authentication authentication, @PathVariable Long cartId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        Long userId = user.getId();

        Optional<Cart> cart = cartService.getCartById(cartId);

        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (hasRole("ADMIN") || cart.get().getUser().getId().equals(userId)) {
            return ResponseEntity.ok(cart.get());
        }

        return ResponseEntity.status(403).build(); // 403 Forbidden
    }

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    @GetMapping("/{cartId}/items")
    public ResponseEntity<List<CartItem>> getCartItems(Authentication authentication, @PathVariable Long cartId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        Long userId = user.getId();

        Optional<Cart> cart = cartService.getCartById(cartId);

        if (cart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (hasRole("ADMIN") || cart.get().getUser().getId().equals(userId)) {
            return ResponseEntity.ok(cartService.getCartItems(cartId));
        }

        return ResponseEntity.status(403).build();
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping
    public ResponseEntity<Cart> findUserCartHandler(Authentication authentication) throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        Cart cart = cartService.findUserCart(user);
        return ResponseEntity.ok(cart);
    }

    @PreAuthorize("hasAuthority('USER')")
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Cart cart = cartRepository.findByUserId(user.getId());
        if (cart == null) {
            throw new RuntimeException("Cart not found for user");
        }
        Optional<Cart> cartAfterClear = cartService.getCartById(cart.getId());

        if (cartAfterClear.isEmpty() || !cartAfterClear.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        cartService.clearCart(cart.getId());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAuthority('USER')")
    @PutMapping("/add")
    public ResponseEntity<CartItem> addCartItemToCart(Authentication authentication, @RequestBody AddProductRequest req)
            throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();

        User user = userRepository.findByEmail(email);
        Product product = productService.getProductById(req.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        CartItem item = cartService.addCartItem(user, product, req.getQuantity(), req.getSize(), req.getColor());

        return new ResponseEntity<>(item, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('USER')")
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItem(Authentication authentication, @PathVariable Long cartItemId)
            throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Cart cart = cartRepository.findByUserId(user.getId());
        if (cart == null) {
            throw new RuntimeException("Cart not found for user");
        }

        cartItemService.removeCartItem(user.getId(), cart.getId(), cartItemId);

        ApiResponse res = new ApiResponse();
        res.setMessage("Item Remove From Cart");
        res.setSuccess(true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('USER')")
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItem(Authentication authentication, @PathVariable Long cartItemId,
            @RequestBody CartItem cartItem) throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        CartItem updatedCartItem = null;
        if (cartItem.getQuantity() > 0) {
            updatedCartItem = cartItemService.updateCartItem(user.getId(), cartItemId, cartItem);
        }
        return new ResponseEntity<>(updatedCartItem, HttpStatus.OK);
    }
}