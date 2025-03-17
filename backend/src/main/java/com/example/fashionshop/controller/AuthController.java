package com.example.fashionshop.controller;

import com.example.fashionshop.enums.Gender;
import com.example.fashionshop.enums.Role;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.request.LogInRequest;
import com.example.fashionshop.request.RegisterRequest;
import com.example.fashionshop.response.AuthResponse;
import com.example.fashionshop.service.AuthService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody RegisterRequest req) throws MessagingException, MessagingException {
        String message = authService.sendOtp(req);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> createUser(@RequestParam("otp") String otp, @RequestBody RegisterRequest req) throws MessagingException {
        String token = authService.createUser(otp, req);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setRole(Role.USER);
        authResponse.setMessage("Đăng ký thành công!");

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> logIn(@Valid @RequestBody LogInRequest req) {
        AuthResponse authResponse = authService.logIn(req);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }
}
