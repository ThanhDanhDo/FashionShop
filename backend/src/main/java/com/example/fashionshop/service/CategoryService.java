package com.example.fashionshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.Category;
import com.example.fashionshop.repository.ProductRepository;
import com.example.fashionshop.repository.CategoryRepository;

import jakarta.transaction.Transactional;

import java.util.Optional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCate() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCateById(Long id) {
        return categoryRepository.findById(id);
    }

    public List<Category> getCateByName(String name) {
        return categoryRepository.findByName(name);
    }

    public List<Category> findByParentCategoryIsNull() {
        return categoryRepository.findByParentCategoryIsNull();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public Category addCategory(Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
        return categoryRepository.save(category);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public Category updateCategory(Long id, Category updatedCategory) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        existingCategory.setName(updatedCategory.getName());
        existingCategory.setParentCategory(updatedCategory.getParentCategory());
        return categoryRepository.save(existingCategory);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}