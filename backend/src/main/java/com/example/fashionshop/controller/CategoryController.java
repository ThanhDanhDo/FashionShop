package com.example.fashionshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public ResponseEntity<List<Category>> getCateByName(@PathVariable String name){
        List<Category> categories = categoryService.getCateByName(name);
        if(categories != null)
            return ResponseEntity.ok(categories);
        else
            return ResponseEntity.notFound().build();
    }   
}
