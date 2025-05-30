package com.example.fashionshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fashionshop.model.Category;
import com.example.fashionshop.service.CategoryService;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCate() {
        List<Category> categories = categoryService.getAllCate();
        return ResponseEntity.ok(categories != null ? categories : Collections.emptyList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCateById(@PathVariable Long id) {
        Optional<Category> category = categoryService.getCateById(id);
        if (category.isPresent()) {
            return ResponseEntity.ok(category.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No category found with id: " + id);
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getCateByName(@PathVariable String name) {
        List<Category> categories = categoryService.getCateByName(name);
        if (categories != null && !categories.isEmpty()) {
            return ResponseEntity.ok(categories);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No categories found with name: " + name);
        }
    }

    @GetMapping("/main")
    public ResponseEntity<List<Category>> getMainCategories() {
        List<Category> mainCategories = categoryService.findByParentCategoryIsNull();
        return ResponseEntity.ok(mainCategories != null ? mainCategories : Collections.emptyList());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try {
            Category response = categoryService.addCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding category: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        try {
            Category response = categoryService.updateCategory(id, category);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating category with id: " + id + ", Error: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok("Category deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No category found with id: " + id);
        }
    }
}