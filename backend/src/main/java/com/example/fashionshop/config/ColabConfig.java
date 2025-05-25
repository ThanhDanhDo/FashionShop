package com.example.fashionshop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
@Getter
public class ColabConfig {
    @Value("${colab.ngrok_link}")
    private String ngrok_link;
}
