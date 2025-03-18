package com.example.fashionshop.controller;

import com.example.fashionshop.model.Product;
import com.example.fashionshop.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Product>> getProductById(@PathVariable Long id){
        Optional<Product> product = productService.getProductById(id);

        if(product != null)
            return ResponseEntity.ok(product);
        else
            return ResponseEntity.notFound().build();
    }

}
