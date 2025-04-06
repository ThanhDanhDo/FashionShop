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
            if (cartItem.getQuantity() != 0){
                item.setQuantity(cartItem.getQuantity());
            }
            if (cartItem.getSize() != null){
                item.setSize(cartItem.getSize());
            }

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
    public void removeCartItem(Long userId, Long cartId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found in cart"));
        User cartItemUser = item.getCart().getUser();
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cartItemUser.getId().equals(userId)) {
            cart.getCartItems().remove(item);
            cartItemRepository.deleteById(item.getId());
            cart.updateTotalPrice();
            cartRepository.save(cart);
        } else {

            throw new RuntimeException("You can't remove another user's item");
        }
    }
}
