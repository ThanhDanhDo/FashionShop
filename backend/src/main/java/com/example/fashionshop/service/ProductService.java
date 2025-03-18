package com.example.fashionshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.repository.ProductRepository;

import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    public Optional<Product> getProductById(Long id){
        return productRepository.findById(id);
    }
}
