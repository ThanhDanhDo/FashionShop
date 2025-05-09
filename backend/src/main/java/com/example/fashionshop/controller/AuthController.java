package com.example.fashionshop.controller;

import com.example.fashionshop.request.LogInRequest;
import com.example.fashionshop.request.OtpRequest;
import com.example.fashionshop.request.RegisterRequest;
import com.example.fashionshop.response.ApiResponse;
import com.example.fashionshop.service.AuthService;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
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
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> sendOtp(@Valid @RequestBody RegisterRequest req) throws MessagingException {
        String message = authService.sendOtp(req);
        return new ResponseEntity<>(new ApiResponse(message, true, null), HttpStatus.CREATED);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> createUser(@RequestBody OtpRequest req, HttpServletResponse response)
            throws MessagingException {
        String message = authService.createUser(req, response);
        return new ResponseEntity<>(new ApiResponse(message, true, null), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> logIn(@Valid @RequestBody LogInRequest req, HttpServletResponse response) {
        String message = authService.logIn(req, response);
        User user = userRepository.findByEmail(req.getEmail()); // Lấy thông tin user từ database
        return new ResponseEntity<>(new ApiResponse(message, true, user), HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logOut(HttpServletResponse response) {
        String message = authService.logOut(response);
        return new ResponseEntity<>(new ApiResponse(message, true, null), HttpStatus.OK);
    }
}
