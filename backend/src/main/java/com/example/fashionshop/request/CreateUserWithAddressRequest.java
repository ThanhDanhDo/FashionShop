package com.example.fashionshop.request;

import lombok.Data;

@Data
public class CreateUserWithAddressRequest {
    // User fields
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String gender;
    private String role;

    // Address fields
    private String province;
    private String district;
    private String ward;
    private String fullAddress;
    private String phone;
}