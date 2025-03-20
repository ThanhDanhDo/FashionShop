package com.example.fashionshop.controller;

import com.example.fashionshop.model.User;
import com.example.fashionshop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUserHandler(Authentication authentication) throws Exception {
        User user = userService.getCurrentUserProfile(authentication);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/profile")
    public ResponseEntity<User> updateCurrentUserHandler(Authentication authentication, @RequestBody User updatedUser) throws Exception {
        User user = userService.updateCurrentUserProfile(authentication, updatedUser);
        return ResponseEntity.ok(user);
    }


}
