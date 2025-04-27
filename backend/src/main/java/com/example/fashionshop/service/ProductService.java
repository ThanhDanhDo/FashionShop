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

//    @Transactional
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
        // Validate and normalize gender
        String[] genderValues = new String[0]; // Default to empty array instead of null
        if (gender != null && !gender.equalsIgnoreCase("all")) {
            if (gender.equalsIgnoreCase("Men")) {
                genderValues = new String[] { "Men", "Unisex" };
            } else if (gender.equalsIgnoreCase("Women")) {
                genderValues = new String[] { "Women", "Unisex" };
            } else if (gender.equalsIgnoreCase("Unisex")) {
                genderValues = new String[] { "Unisex" };
            } else {
                throw new IllegalArgumentException("Invalid gender value: " + gender);
            }
        }

        // Validate mainCategoryId
        if (mainCategoryId != null) {
            categoryRepository.findById(mainCategoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Main category not found: " + mainCategoryId));
        }

        // Validate subCategoryId
        if (subCategoryId != null) {
            categoryRepository.findById(subCategoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Sub category not found: " + subCategoryId));
        }

        // Normalize priceRanges
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

        // Convert sizes and colors to arrays, default to empty array if null or empty
        String[] sizesArray = sizes != null && !sizes.isEmpty() ? sizes.toArray(new String[0]) : new String[0];
        String[] colorsArray = colors != null && !colors.isEmpty() ? colors.toArray(new String[0]) : new String[0];

        System.out.println("Filter params: gender=" + Arrays.toString(genderValues) +
                ", mainCategoryId=" + mainCategoryId +
                ", subCategoryId=" + subCategoryId +
                ", sizes=" + Arrays.toString(sizesArray) +
                ", colors=" + Arrays.toString(colorsArray) +
                ", priceMin=" + priceMin +
                ", priceMax=" + priceMax);

        Page<Product> result = productRepository.findByFilters(
                genderValues,
                mainCategoryId,
                subCategoryId,
                sizesArray,
                colorsArray,
                priceMin,
                priceMax,
                pageable);

        if (result.isEmpty()) {
            System.out.println("No products found for filters: gender=" + Arrays.toString(genderValues) +
                    ", mainCategoryId=" + mainCategoryId +
                    ", subCategoryId=" + subCategoryId);
        } else {
            System.out.println("Found " + result.getTotalElements() + " products for filters");
        }

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
    @Transactional //Hàm này update được có 4 thuộc tính à, size color hông được
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
}