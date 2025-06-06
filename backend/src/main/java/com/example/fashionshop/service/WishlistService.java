package com.example.fashionshop.service;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.model.Wishlist;
import com.example.fashionshop.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishlistRepository wishlistRepository;

    public Wishlist createWishlist (User user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        return wishlistRepository.save(wishlist);
    }

    public Wishlist getWishlistByUserId(User user) {
        Optional<Wishlist> optionalWishlist = wishlistRepository.findByUserId(user.getId());
        if (optionalWishlist.isPresent()) {
            return optionalWishlist.get();
        } else {
            return this.createWishlist(user);
        }
    }

    public Wishlist toggleWishlistItem (User user, Product product) throws Exception {
        Wishlist wishlist = this.getWishlistByUserId(user);
        if (wishlist.getProducts().contains(product)){
            wishlist.getProducts().remove(product);
        }
        else wishlist.getProducts().add(product);

        return wishlistRepository.save(wishlist);
    }
}
