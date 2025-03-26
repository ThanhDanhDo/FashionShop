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

import java.util.List;
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCate(){
        List<Category> categories = categoryService.getAllCate();
        if(categories != null)
            return ResponseEntity.ok(categories);
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getCateByName(@PathVariable String name){
        List<Category> categories = categoryService.getCateByName(name);
        if(categories != null)
            return ResponseEntity.ok(categories);
        else
            return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try{
            Category response = categoryService.addCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(response); 
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding products with error: " + e);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        try{
            Category response = categoryService.updateCategory(id, category);
            return ResponseEntity.status(HttpStatus.CREATED).body(response); 
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating products with id: " + id + ", Error: " + e);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try{
            categoryService.deleteCategory(id);
            return ResponseEntity.ok("Product deleted successfully");
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No category found");
        }
    }
}
