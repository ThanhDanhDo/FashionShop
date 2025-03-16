package com.example.fashionshop.controller;

import com.example.fashionshop.enums.Gender;
import com.example.fashionshop.model.User;
import com.example.fashionshop.request.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<User> createUserHandler(@RequestBody RegisterRequest req) {
        User user = new User();

        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setGender(Gender.valueOf(req.getGender()));

        return ResponseEntity.ok(user);
    }
}
