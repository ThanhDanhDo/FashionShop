package com.example.fashionshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.Category;
import com.example.fashionshop.repository.ProductRepository;

import jakarta.transaction.Transactional;

import com.example.fashionshop.repository.CategoryRepository;

import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    private Category findOrCreateCategory(Long cateId, String name, Long parentId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
    
        Optional<Category> existingCategory;
    
        if (cateId != null) {
            existingCategory = categoryRepository.findById(cateId);
        } else {
            existingCategory = categoryRepository.findByName(name);
        }
    
        if (existingCategory.isPresent()) {
            return existingCategory.get();
        }
    
        Category parentCategory = (parentId != null) 
            ? categoryRepository.findById(parentId).orElse(null) 
            : null;
    
        Category newCategory = new Category();
        newCategory.setName(name);
        newCategory.setParentCategory(parentCategory);
    
        return categoryRepository.save(newCategory);
    }    

    private Category processCategory(Category category) {
        if (category == null) {
            return null;
        }
    
        Long categoryId = category.getId();
        String name = category.getName();
        Long parentCategoryId = (category.getParentCategory() != null) ? category.getParentCategory().getId() : null;
    
        return findOrCreateCategory(categoryId, name, parentCategoryId);
    }
    
    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository){
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Optional<Product> getProductById(Long id){
        return productRepository.findById(id);
    }

    public Page<Product> getAllProduct(Pageable pageable){
        return productRepository.findAll(pageable);
    }

    public Map<String, Page<Product>> getProductByCate(Category category, Pageable pageable) {
        Page<Product> mainCategoryProducts = productRepository.findByMainCategory(category, pageable);
        Page<Product> subCategoryProducts = productRepository.findBySubCategory(category, pageable);

        Map<String, Page<Product>> result = new HashMap<>();
        result.put("mainCategory", mainCategoryProducts);
        result.put("subCategories", subCategoryProducts);

        return result;
    }

    public List<Product> getProductByName(String name){
        if (name == null || name.isEmpty()) {
            throw new RuntimeException("Product list is empty or null");
        }

        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public Product addProduct(Product product){
        if (product.getMainCategory() != null) {
            product.setMainCategory(processCategory(product.getMainCategory()));
        }

        if (product.getSubCategory() != null) {
            product.setSubCategory(processCategory(product.getSubCategory()));
        }

        return productRepository.save(product);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public Product updateProduct(Product updatedProduct) {
        Product existingProduct = productRepository.findById(updatedProduct.getId())
            .orElseThrow(() -> new RuntimeException("Product not found"));
    
        if (updatedProduct.getName() != null) {
            existingProduct.setName(updatedProduct.getName());
        }
    
        if (updatedProduct.getPrice() != null) {
            existingProduct.setPrice(updatedProduct.getPrice());
        }
    
        if (updatedProduct.getMainCategory() != null) {
            existingProduct.setMainCategory(processCategory(updatedProduct.getMainCategory()));
        }
    
        if (updatedProduct.getSubCategory() != null) {
            existingProduct.setSubCategory(processCategory(updatedProduct.getSubCategory()));
        }
    
        return productRepository.save(existingProduct);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteProduct(Long id){
        Product product = getProductById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        productRepository.deleteById(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Product> addProducts(List<Product> products) {
        if (products == null || products.isEmpty()) {
            throw new RuntimeException("Product list is empty or null");
        }

        List<Product> addedProducts = new ArrayList<>();
        for (Product product : products) {
            addedProducts.add(addProduct(product));
        }

        return addedProducts;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Map<String, List<Product>> updateProducts(List<Product> products) {
        if (products == null || products.isEmpty()) {
            throw new RuntimeException("Product list is empty or null");
        }
    
        List<Product> updatedProducts = new ArrayList<>();
        List<Product> failedProducts = new ArrayList<>();
    
        for(Product product : products) {
            try {
                updatedProducts.add(updateProduct(product));
            } catch (RuntimeException e) {
                failedProducts.add(product);
            }
        }
    
        return Map.of(
            "updated", updatedProducts,
            "failed", failedProducts
        );
    }    
}
