package com.example.fashionshop.repository;

import com.example.fashionshop.model.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface verificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    public VerificationCode findByEmail(String email);
}
