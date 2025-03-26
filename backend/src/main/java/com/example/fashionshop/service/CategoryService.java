package com.example.fashionshop.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.fashionshop.model.Category;
import com.example.fashionshop.repository.CategoryRepository;

import java.util.Optional;
@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCate(){
        return categoryRepository.findAll();
    }

    public Optional<Category> getCateById(Long categoryId){
        return categoryRepository.findById(categoryId);
    }

    public List<Category> getCateByName(String name){
        return categoryRepository.findByNameContaining(name);
    }

    @Transactional
    public Category addCategory(Category category) {
        if (category == null || category.getName() == null || category.getName().isEmpty()) {
            throw new RuntimeException("Category name empty");
        }

        if (category.getParentCategory() != null && category.getParentCategory().getId() != null) {
            Category parent = categoryRepository.findById(category.getParentCategory().getId()).orElse(null);
            if (parent != null) {
                category.setParentCategory(parent);
            }
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, Category updatedCategory) {
        Category existingCategory = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category empty"));

        if (updatedCategory.getName() != null) {
            existingCategory.setName(updatedCategory.getName());
        }

        if (updatedCategory.getParentCategory() != null && updatedCategory.getParentCategory().getId() != null) {
            Long parentId = updatedCategory.getParentCategory().getId();
            categoryRepository.findById(parentId).ifPresent(existingCategory::setParentCategory);
        }

        return categoryRepository.save(existingCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Must fill in category id");
        }

        Category category = getCateById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));

        List<Category> subCategories = categoryRepository.findByParentCategoryId(id);
        subCategories.forEach(subCategory -> subCategory.setParentCategory(null));
        categoryRepository.saveAll(subCategories);

        categoryRepository.deleteById(id);
    }
    
}
