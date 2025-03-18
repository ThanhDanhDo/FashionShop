package com.example.fashionshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.fashionshop.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{
    
}
