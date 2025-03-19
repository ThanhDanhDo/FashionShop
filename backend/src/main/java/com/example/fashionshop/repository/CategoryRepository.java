package com.example.fashionshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.fashionshop.model.Category;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>{
    List<Category> findByNameContaining(String keyword);
}
