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
import java.util.ArrayList;

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

        // Kiểm tra cartItem đã tồn tại
        CartItem existingItem = cartItemRepository.findByCartIdAndProductIdAndSizeAndColor(
            cart.getId(), 
            product.getId(),
            cartItem.getSize(),
            cartItem.getColor()
        ).orElse(null);

        CartItem newCartItem;
        if (existingItem == null) {
            // Tạo mới nếu chưa tồn tại
            newCartItem = new CartItem();
            newCartItem.setCart(cart);
            newCartItem.setProduct(product);
            newCartItem.setSize(cartItem.getSize());
            newCartItem.setColor(cartItem.getColor());
            newCartItem.setQuantity(0);
        } else {
            newCartItem = existingItem;
        }

        // Cập nhật số lượng
        int newQuantity = newCartItem.getQuantity() + cartItem.getQuantity();
        if (newQuantity > product.getStock()) {
            newQuantity = product.getStock().intValue();
        } else if (newQuantity <= 0) {
            if (existingItem != null) {
                cartItemRepository.delete(existingItem);
            }
            return null;
        }
        newCartItem.setQuantity(newQuantity);
        
        return cartItemRepository.save(newCartItem);
    }

    @Transactional
    public void deleteCartItem(CartItem cartItem) {
        CartItem existItem = cartItemRepository.findByCartIdAndProductIdAndSizeAndColor(
            cartItem.getCart().getId(), 
            cartItem.getProduct().getId(),
            cartItem.getSize(),
            cartItem.getColor()
        ).orElseThrow(() -> new RuntimeException("CartItem not found in cart"));

        cartItemRepository.delete(existItem);
    }
}
