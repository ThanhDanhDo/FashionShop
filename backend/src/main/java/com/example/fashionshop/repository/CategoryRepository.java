package com.example.fashionshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.fashionshop.model.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

    List<Category> findByNameContaining(String keyword);

    List<Category> findByParentCategoryId(Long parentCategoryId);

    List<Category> findByParentCategoryIsNull();
}
