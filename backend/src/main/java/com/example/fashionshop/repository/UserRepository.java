package com.example.fashionshop.repository;

import com.example.fashionshop.enums.Role;
import com.example.fashionshop.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findAll(Pageable pageable);
    Page<User> findAllByRole(Role role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE " +
            "(:firstName IS NULL OR u.firstName LIKE %:firstName%) AND " +
            "(:email IS NULL OR u.email LIKE %:email%)")
    Page<User> searchUsers(String firstName, String email, Pageable pageable);

    User findByEmail(String email);
    long countByRole(Role role);
}
