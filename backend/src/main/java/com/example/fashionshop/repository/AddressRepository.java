package com.example.fashionshop.repository;

import com.example.fashionshop.model.Address;
import com.example.fashionshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser_Id(Long userId);
    List<Address> findByUser_Email(String email);
    Optional<Address> findByUserAndIsDefaultTrue(User user);
    boolean existsByUser(User user);
}
