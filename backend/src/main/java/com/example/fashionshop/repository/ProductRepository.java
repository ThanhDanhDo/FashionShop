package com.example.fashionshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.model.Category;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{
    Page<Product> findAll(Pageable pageable);
    Page<Product> findByMainCategory(Category mainCategory, Pageable pageable);
    Page<Product> findBySubCategory(Category subCategory, Pageable pageable);
}
