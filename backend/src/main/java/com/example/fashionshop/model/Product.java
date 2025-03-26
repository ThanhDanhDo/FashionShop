package com.example.fashionshop.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name= "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 225)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(nullable = false)
    private Long stock;
    
    @ManyToOne
    @JoinColumn(name = "main_category_id", nullable = false)
    private Category mainCategory;
    
    @ManyToOne
    @JoinColumn(name = "sub_category_id")
    private Category subCategory;
    
    private List<String> size;
    
    private List<String> color;

    private List<String> imgUrls;
}
