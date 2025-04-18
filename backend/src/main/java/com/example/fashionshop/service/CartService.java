package com.example.fashionshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.example.fashionshop.repository.CartItemRepository;
import com.example.fashionshop.repository.CartRepository;
import com.example.fashionshop.enums.CartStatus;
import com.example.fashionshop.model.Cart;
import com.example.fashionshop.model.CartItem;
import com.example.fashionshop.model.Product;

import java.util.Optional;
import java.util.List;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Autowired
    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository){
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public Optional<Cart> getCartById(Long cartId) {
        return cartRepository.findById(cartId);
    }

    public List<CartItem> getCartItems(Long cartId) {
        Cart cart = getCartById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

        return cartItemRepository.findByCartId(cart.getId());
    }

    @Transactional
    public Cart createCart(Long userId){
        if(userId == null){
            throw new IllegalArgumentException("Must fill in userId");
        }

        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
            .orElse(new Cart(userId, CartStatus.ACTIVE));
        
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Long cartId) {
        Cart cart = getCartById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));
        cartItemRepository.deleteByCartId(cartId);
    }

    @Transactional
    public void deleteCart(Long cartId) {
        Cart cart = getCartById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteByCartId(cartId);
        cartRepository.delete(cart);
    }

    @Transactional
    public void updateStatusCart(Long cartId, CartStatus cartStatus) {
        Cart cart = getCartById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));
    
        if (cart.getCartItems().isEmpty()){
            throw new RuntimeException("Cannot checkout an empty cart");
        }

        if (cartStatus == CartStatus.ORDERED) {
            List<CartItem> validItems = cart.getCartItems().stream()
                .filter(item -> item.getQuantity() <= item.getProduct().getStock())
                .toList();
    
            cart.setCartItems(validItems);
            
            validItems.forEach(item -> {
                Product product = item.getProduct();
                product.setStock(product.getStock() - item.getQuantity());
            });
    
            if(validItems.isEmpty()){
                throw new RuntimeException("Cannot place an order with no available items.");
            }
        }

        if (cartStatus == CartStatus.CANCELED) {
            cart.getCartItems().forEach(item -> 
                item.getProduct().setStock(item.getProduct().getStock() + item.getQuantity())
            );
    
            cartRepository.delete(cart);
            return;
        }

        cart.setStatus(cartStatus);
        cartRepository.save(cart);
    }
}
