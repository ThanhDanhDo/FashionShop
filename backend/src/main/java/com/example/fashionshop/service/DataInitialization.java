package com.example.fashionshop.service;

import com.example.fashionshop.enums.Gender;
import com.example.fashionshop.enums.Role;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitialization implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        String adminUsername = "fashionShop@gmail.com";

        if (userRepository.findByEmail(adminUsername)==null) {
            User adminUser = new User();

            adminUser.setEmail(adminUsername);
            adminUser.setPassword(passwordEncoder.encode("123456"));
            adminUser.setFirstName("Fashion");
            adminUser.setLastName("Shop");
            adminUser.setGender(Gender.Women);
            adminUser.setRole(Role.ADMIN);

            User admin=userRepository.save(adminUser);
        }
    }
}
