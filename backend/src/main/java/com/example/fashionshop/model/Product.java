package com.example.fashionshop.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.util.List;

import com.example.fashionshop.enums.Gender;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product")
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

    @Column(columnDefinition = "text[]")
    private List<String> size;

    @Column(columnDefinition = "text[]")
    private List<String> color;

    @Column(columnDefinition = "text[]")
    private List<String> imgurls;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false) // , columnDefinition = "gender_type"
    private Gender gender;
}