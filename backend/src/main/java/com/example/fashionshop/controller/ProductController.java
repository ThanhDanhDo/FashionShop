package com.example.fashionshop.controller;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Locale.Category;
import java.util.HashMap;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Optional<Product>> getProductById(@PathVariable Long id){
        Optional<Product> product = productService.getProductById(id);

        if(product != null)
            return ResponseEntity.ok(product);
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/all")
    public ResponseEntity<Page<Product>> getAllProduct(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getAllProduct(pageable);

        if(products != null)
            return ResponseEntity.ok(products);
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("type/{type}")
    public ResponseEntity<Page<Product>> getProductByCate(
        @PathVariable Category cate,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getProductByCate(cate, pageable);

        if(products != null)
            return ResponseEntity.ok(products);
        else
            return ResponseEntity.notFound().build();
    }
}
