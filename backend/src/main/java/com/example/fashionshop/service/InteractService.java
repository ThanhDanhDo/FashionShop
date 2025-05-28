package com.example.fashionshop.service;

import com.example.fashionshop.model.Interact;
import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.InteractRepository;
import com.example.fashionshop.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InteractService {

    private final InteractRepository interactRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Interact addInteract(User user, Product product){
        Integer userId = user.getId().intValue();
        Long productId = product.getId();

//        Optional<Interact> existingInteract = interactRepository.findByUserIdAndProductId(userId, productId);
//        if (existingInteract.isPresent()) {
//            return existingInteract.get();
//        }
        Interact interact = new Interact();
        interact.setUserId(userId);
        interact.setProduct(product);

        return interactRepository.save(interact);
    }

    public List<Product> getInteractToRecommendation(User user) throws IOException, InterruptedException {
        String userId = user.getId().toString();

        List<Interact> interacts = interactRepository.findAllByUserId(user.getId().intValue());
        List<String> productIds = interacts.stream()
                .map(interact -> String.valueOf(interact.getProduct().getId()))
                .collect(Collectors.toList());
        if (productIds.isEmpty()) {
            return Collections.emptyList();
        }

        String newItemId = productIds.remove(productIds.size() - 1);
        String sequence = String.join(",", productIds);

        ProcessBuilder pb = new ProcessBuilder(
                "./run_recommend.sh",
                userId,
                newItemId,
                sequence
        );
        pb.directory(new File("recommendation/JAVA_REC"));
        pb.redirectErrorStream(true);
        Process process = pb.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line);
        }
        int exitCode = process.waitFor();

        String[] recProductIds = output.toString().split(",");
        List<Long> recommended = Arrays.stream(recProductIds)
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());

        List<Product> recommendedProducts = productRepository.findByIdIn(recommended);

        return recommendedProducts;
    }

}
