package com.example.fashionshop.service;

import com.example.fashionshop.model.User;
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
    public CartItem updateCartItem(Long userId, Long cartItemId, CartItem cartItem) {
        CartItem item = cartItemRepository.findById(cartItemId).orElseThrow(() -> new RuntimeException("CartItem not found in cart"));
        User cartItemUser = item.getCart().getUser();

        if (cartItemUser.getId().equals(userId)) {
            item.setQuantity(cartItem.getQuantity());
            item.setSize(cartItem.getSize());
            item.setTotalPrice(item.getQuantity()*item.getProduct().getPrice());

            item.getCart().updateTotalPrice();
            cartRepository.save(item.getCart());

            return cartItemRepository.save(item);
        }
        else {
            throw new RuntimeException("You can't update  another users cart_item");
        }
    }

    @Transactional
    public void removeCartItem(Long userId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId).orElseThrow(() -> new RuntimeException("CartItem not found in cart"));
        User cartItemUser = item.getCart().getUser();

        if (cartItemUser.getId().equals(userId)) {
            cartItemRepository.deleteById(item.getId());
            item.getCart().updateTotalPrice();
            cartRepository.save(item.getCart());
        }
        else {
            throw new RuntimeException("you can't remove anothor users item");
        }
    }
}
