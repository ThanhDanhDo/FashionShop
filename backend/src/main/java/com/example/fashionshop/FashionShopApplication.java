package com.example.fashionshop;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FashionShopApplication {
    private static void loadEnvVar(){
        Dotenv dotenv = Dotenv.configure()
            .directory("src/main/resources")
            .load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }

    public static void main(String[] args) {
        loadEnvVar();
        
        SpringApplication.run(FashionShopApplication.class, args);
    }
}
