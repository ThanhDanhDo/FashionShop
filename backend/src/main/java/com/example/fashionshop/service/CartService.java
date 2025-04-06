package com.example.fashionshop.service;

import com.example.fashionshop.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.example.fashionshop.repository.CartItemRepository;
import com.example.fashionshop.repository.CartRepository;
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
    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository) {
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

    public Cart getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId);
        return cart;
    }

    @Transactional
    public Cart findUserCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());

        int totalItems = 0;
        int totalCartPrice = 0;
        for (CartItem cartItem : cart.getCartItems()) {
            totalItems += cartItem.getQuantity();
            totalCartPrice += cartItem.getTotalPrice();
        }
        cart.setTotalItems(totalItems);
        cart.setTotalCartPrice(totalCartPrice);

        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Long cartId) {
        Cart cart = getCartById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getCartItems().clear();
        cartItemRepository.deleteByCartId(cartId);
        cart.updateTotalPrice();
        cartRepository.save(cart);
    }

    @Transactional
    public CartItem addCartItem(User user, Product product, int quantity, String size) {
        Cart cart = findUserCart(user);

        CartItem existingCartItem = cartItemRepository.findByCartAndProductAndSize(cart, product, size);

        if (existingCartItem == null) {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setSize(size);
            double totalPrice = quantity * product.getPrice();
            cartItem.setTotalPrice(totalPrice);
            cartItemRepository.save(cartItem);

            cart.getCartItems().add(cartItem);
            cartRepository.save(cart);

            return cartItem;
        } else {
            int newQuantity = existingCartItem.getQuantity() + quantity;
            existingCartItem.setQuantity(newQuantity);
            existingCartItem.setTotalPrice(newQuantity * product.getPrice());

            return cartItemRepository.save(existingCartItem);
        }
    }

}
