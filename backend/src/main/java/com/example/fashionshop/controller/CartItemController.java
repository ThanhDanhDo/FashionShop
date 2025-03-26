package com.example.fashionshop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.fashionshop.service.CartItemService;
import com.example.fashionshop.model.CartItem;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {
    private final CartItemService cartItemService;

    @Autowired
    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/add")
    public ResponseEntity<CartItem> addCartItem(@RequestBody CartItem cartItem) {
        CartItem savedCartItem = cartItemService.addCartItem(cartItem);
        return ResponseEntity.ok(savedCartItem);
    }

    @PreAuthorize("hasAuthority('USER')")
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteCartItem(@RequestBody CartItem cartItem) {
        cartItemService.deleteCartItem(cartItem);
        return ResponseEntity.noContent().build();
    }
}
