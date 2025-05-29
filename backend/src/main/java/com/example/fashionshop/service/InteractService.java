package com.example.fashionshop.service;

import com.example.fashionshop.model.Interact;
import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.InteractRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class InteractService {

    private final InteractRepository interactRepository;

    public Interact addInteract(User user, Product product){
        Integer userId = user.getId().intValue();
        Long productId = product.getId();
        Optional<Interact> existingInteract = interactRepository.findByUserIdAndProductId(userId, productId);

        if (existingInteract.isPresent()) {
            return existingInteract.get();
        }
        Interact interact = new Interact();
        interact.setUserId(userId);
        interact.setProduct(product);

        return interactRepository.save(interact);
    }
    
}
