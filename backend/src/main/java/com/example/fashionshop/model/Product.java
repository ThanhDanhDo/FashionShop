package com.example.fashionshop.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name= "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String url;

    @Column(nullable = false)
    private long quantity;
    @Column(nullable = false)
    private long price;
    private String discription;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "id")
    private Set<ProductTypes> productTypes = new HashSet<>();
}
