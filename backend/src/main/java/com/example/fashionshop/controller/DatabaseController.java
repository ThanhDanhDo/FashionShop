package com.example.fashionshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/db")
public class DatabaseController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/test")
    public String testConnection() {
        String result = jdbcTemplate.queryForObject("SELECT NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh';", String.class);
        return "Database Time: " + result;
    }
}
