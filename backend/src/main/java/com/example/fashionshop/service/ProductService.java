package com.example.fashionshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.repository.ProductRepository;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Locale.Category;
import java.util.List;
import java.util.Map;

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

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Product addProduct(Product product){
        Long productId = product.getId();
        if(productId == null || productRepository.existsById(productId)){
            throw new RuntimeException("Error in input, id is existed or null");
        }

        return productRepository.save(product);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Product updateProduct(Product product){
        Long productId = product.getId();
        if(productId == null || !productRepository.existsById(productId)){
            throw new RuntimeException("Error in input, id is not exist or null");
        }

        return productRepository.save(product);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteProduct(Long id){
        if(!productRepository.existsById(id)){
            throw new RuntimeException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Map<String, List<Product>> addProducts(List<Product> products){
        if(products == null || products.isEmpty()){
            throw new RuntimeException("Product list is empty or null");
        }  

        Map<Boolean, List<Product>> partitioned = products.stream()
            .collect(Collectors.partitioningBy(product -> 
                product.getId() != null && !productRepository.existsById(product.getId()))
            );

        List<Product> addedProducts = productRepository.saveAll(partitioned.get(true));
        
        return Map.of(
            "updated", addedProducts,
            "failed", partitioned.get(false)
        );
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Map<String, List<Product>> updateProducts(List<Product> products){
        if(products == null || products.isEmpty()){
            throw new RuntimeException("Product list is empty or null");
        }  

        Map<Boolean, List<Product>> partitioned = products.stream()
            .collect(Collectors.partitioningBy(product -> 
                product.getId() != null && productRepository.existsById(product.getId()))
            );

        List<Product> updatedProducts = productRepository.saveAll(partitioned.get(true));
        
        return Map.of(
            "updated", updatedProducts,
            "failed", partitioned.get(false)
        );
    }
}
