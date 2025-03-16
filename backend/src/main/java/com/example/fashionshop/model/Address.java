package com.example.fashionshop.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //tu dong
    private Long id;

    private String province;
    private String district;
    private String ward;

    private String fullAddress;

    private String phone;
}
