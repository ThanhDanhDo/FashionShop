package com.example.fashionshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.repository.ProductRepository;

import java.util.Optional;
import java.util.Locale.Category;

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

    public Page<Product> getAllProduct(Pageable pageable){
        return productRepository.findAll(pageable);
    }

    public Page<Product> getProductByCate(Category category, Pageable pageable){
        return productRepository.findByCategory(category, pageable);
    }
}
