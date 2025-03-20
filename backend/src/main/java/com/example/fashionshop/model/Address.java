package com.example.fashionshop.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //tu dong
    private Long id;

    private String province;
    private String district;
    private String ward;

    private String fullAddress;
    private String phone;
    private boolean isDefault;

    // Liên kết với User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) //khoá ngoại user_id -> User
    private User user;
}
