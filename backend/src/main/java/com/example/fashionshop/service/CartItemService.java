package com.example.fashionshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.example.fashionshop.repository.CartItemRepository;
import com.example.fashionshop.repository.CartRepository;
import com.example.fashionshop.repository.ProductRepository;
import com.example.fashionshop.model.Cart;
import com.example.fashionshop.model.CartItem;
import com.example.fashionshop.model.Product;

@Service
public class CartItemService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Autowired
    public CartItemService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository){
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;

    }

    @Transactional
    public CartItem addCartItem(CartItem cartItem) {
        Cart cart = cartRepository.findById(cartItem.getCart().getId())
            .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(cartItem.getProduct().getId())
            .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem newCartItem = cartItemRepository.findByCartIdAndProductId(cartItem.getCart().getId(), cartItem.getProduct().getId())
            .orElse(new CartItem(cartItem.getCart(), cartItem.getProduct(), 0));

        if(newCartItem.getQuantity() + cartItem.getQuantity() > product.getStock()) {
            newCartItem.setQuantity(product.getStock().intValue());
        }else if(newCartItem.getQuantity() + cartItem.getQuantity() <= 0){
            cartItemRepository.delete(newCartItem);
            return null;
        } else {
            newCartItem.setQuantity(newCartItem.getQuantity() + cartItem.getQuantity());
        }
        
        return cartItemRepository.save(newCartItem);
    }

    @Transactional
    public void deleteCartItem(CartItem cartItem) {
        CartItem existItem = cartItemRepository.findByCartIdAndProductId(cartItem.getCart().getId(), cartItem.getProduct().getId())
            .orElseThrow(() -> new RuntimeException("CartItem not found in cart"));

        cartItemRepository.delete(existItem);
    }
}
