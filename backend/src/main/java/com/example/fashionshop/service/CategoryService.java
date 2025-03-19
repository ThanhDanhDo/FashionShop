package com.example.fashionshop.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.fashionshop.model.Category;
import com.example.fashionshop.repository.CategoryRepository;

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

    public List<Category> getCateByName(String name){
        return categoryRepository.findByNameContaining(name);
    }
}
