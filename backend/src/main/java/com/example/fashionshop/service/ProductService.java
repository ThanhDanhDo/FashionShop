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

import jakarta.transaction.Transactional;

import java.util.Optional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // @Transactional
    private Category findOrCreateCategory(Long cateId, String name, Long parentId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }

        Optional<Category> existingCategory;

        if (cateId != null) {
            existingCategory = categoryRepository.findById(cateId);
        } else {
            List<Category> categories = categoryRepository.findByName(name);
            if (parentId != null) {
                existingCategory = categories.stream()
                        .filter(cat -> cat.getParentCategory() != null
                                && cat.getParentCategory().getId().equals(parentId))
                        .findFirst();
            } else {
                existingCategory = categories.isEmpty() ? Optional.empty() : Optional.of(categories.get(0));
            }
        }

        if (existingCategory.isPresent()) {
            return existingCategory.get();
        }

        Category parentCategory = (parentId != null)
                ? categoryRepository.findById(parentId)
                        .orElseThrow(() -> new IllegalArgumentException("Parent category not found: " + parentId))
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
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Page<Product> getAllProduct(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Page<Product> filterProducts(
            String gender,
            Long mainCategoryId,
            Long subCategoryId,
            List<String> sizes,
            List<String> colors,
            List<String> priceRanges,
            Pageable pageable) {

        String gendersCsv = "";
        if (gender != null && !gender.equalsIgnoreCase("all")) {
            if (gender.equalsIgnoreCase("Men")) {
                gendersCsv = "Men,Unisex";
            } else if (gender.equalsIgnoreCase("Women")) {
                gendersCsv = "Women,Unisex";
            } else if (gender.equalsIgnoreCase("Unisex")) {
                gendersCsv = "Unisex";
            } else {
                throw new IllegalArgumentException("Invalid gender value: " + gender);
            }
        }

        Double priceMin = null;
        Double priceMax = null;
        if (priceRanges != null && !priceRanges.isEmpty()) {
            for (String range : priceRanges) {
                if (range.equals("Under 500.000đ")) {
                    priceMin = 0.0;
                    priceMax = priceMax == null ? 500000.0 : Math.min(priceMax, 500000.0);
                } else if (range.equals("500.000đ - 1.000.000đ")) {
                    priceMin = priceMin == null ? 500000.0 : Math.max(priceMin, 500000.0);
                    priceMax = priceMax == null ? 1000000.0 : Math.min(priceMax, 1000000.0);
                } else if (range.equals("Above 1.000.000đ")) {
                    priceMin = priceMin == null ? 1000000.0 : Math.max(priceMin, 1000000.0);
                    priceMax = priceMax == null ? Double.MAX_VALUE : priceMax;
                }
            }
        }

        // Chuyển sizes và colors thành CSV String
        String sizesCsv = (sizes != null && !sizes.isEmpty()) ? String.join(",", sizes) : "";
        String colorsCsv = (colors != null && !colors.isEmpty()) ? String.join(",", colors) : "";

        Page<Product> result = productRepository.findByFilters(
                gendersCsv,
                mainCategoryId,
                subCategoryId,
                sizesCsv,
                colorsCsv,
                priceMin,
                priceMax,
                pageable);

        return result;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @Transactional
    public Product addProduct(Product product) {
        if (product.getMainCategory() != null) {
            product.setMainCategory(processCategory(product.getMainCategory()));
        }

        if (product.getSubCategory() != null) {
            product.setSubCategory(processCategory(product.getSubCategory()));
        }

        return productRepository.save(product);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @Transactional
    public Product updateProduct(Product updatedProduct) {
        Product existingProduct = productRepository.findById(updatedProduct.getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (updatedProduct.getName() != null) {
            existingProduct.setName(updatedProduct.getName());
        }
        if (updatedProduct.getDescription() != null) {
            existingProduct.setDescription(updatedProduct.getDescription());
        }
        if (updatedProduct.getPrice() != null) {
            existingProduct.setPrice(updatedProduct.getPrice());
        }
        if (updatedProduct.getStock() != null) {
            existingProduct.setStock(updatedProduct.getStock());
        }
        if (updatedProduct.getMainCategory() != null) {
            existingProduct.setMainCategory(processCategory(updatedProduct.getMainCategory()));
        }
        if (updatedProduct.getSubCategory() != null) {
            existingProduct.setSubCategory(processCategory(updatedProduct.getSubCategory()));
        }
        if (updatedProduct.getSize() != null) {
            existingProduct.setSize(updatedProduct.getSize());
        }
        if (updatedProduct.getColor() != null) {
            existingProduct.setColor(updatedProduct.getColor());
        }
        if (updatedProduct.getImgurls() != null) {
            existingProduct.setImgurls(updatedProduct.getImgurls());
        }
        if (updatedProduct.getGender() != null) {
            existingProduct.setGender(updatedProduct.getGender());
        }

        return productRepository.save(existingProduct);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteProduct(Long id) {
        Product product = getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        productRepository.deleteById(id);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
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

    @PreAuthorize("hasAuthority('ADMIN')")
    public Map<String, List<Product>> updateProducts(List<Product> products) {
        if (products == null || products.isEmpty()) {
            throw new RuntimeException("Product list is empty or null");
        }

        List<Product> updatedProducts = new ArrayList<>();
        List<Product> failedProducts = new ArrayList<>();

        for (Product product : products) {
            try {
                updatedProducts.add(updateProduct(product));
            } catch (RuntimeException e) {
                failedProducts.add(product);
            }
        }

        return Map.of(
                "updated", updatedProducts,
                "failed", failedProducts);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<Product> adminFilterProducts(String name, Long id, String gender, Long mainCategoryId, Long subCategoryId, Pageable pageable) {
        return productRepository.adminFilterProducts(name, id, gender, mainCategoryId, subCategoryId, pageable);
    }
}