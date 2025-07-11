package com.example.fashionshop.service;

import com.example.fashionshop.enums.Role;
import com.example.fashionshop.model.Address;
import com.example.fashionshop.model.Cart;
import com.example.fashionshop.model.Order;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    final UserRepository userRepository;
    final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final WishlistRepository wishlistRepository;

    public Page<User> getAllUser(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Page<User> searchUser(String firstName, String email, Pageable pageable) {
        return userRepository.searchUsers(firstName, email, pageable);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(User newUser) throws Exception {
        if (userRepository.findByEmail(newUser.getEmail()) != null) {
            throw new Exception("Email already exists");
        }
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        return userRepository.save(newUser);
    }

    public Long getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return user.getId();
    }

    public User getCurrentUserProfile(Authentication authentication) throws Exception{
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return user;
    }

    public User updateCurrentUserProfile(Authentication authentication, User updatedUser) throws Exception {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        if (updatedUser == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
        }

        // update
        if (updatedUser.getEmail() != null) {
            currentUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getGender()!=null){
            currentUser.setGender(updatedUser.getGender());
        }
        if (updatedUser.getFirstName()!=null){
            currentUser.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            currentUser.setLastName(updatedUser.getLastName());
        }

        // địa chỉ
        Set<Address> updatedAddresses = updatedUser.getAddresses();
        if (updatedAddresses != null && !updatedAddresses.isEmpty()) {
            Address newAddress = updatedAddresses.iterator().next(); // Chỉ lấy một địa chỉ

            Address existingDefaultAddress = addressRepository.findByUserAndIsDefaultTrue(currentUser).orElse(null);

            if (existingDefaultAddress != null) {
                // Cập nhật địa chỉ mặc định hiện tại
                if (newAddress.getProvince() != null && !newAddress.getProvince().isEmpty()) {
                    existingDefaultAddress.setProvince(newAddress.getProvince());
                }
                if (newAddress.getDistrict() != null && !newAddress.getDistrict().isEmpty()) {
                    existingDefaultAddress.setDistrict(newAddress.getDistrict());
                }
                if (newAddress.getWard() != null && !newAddress.getWard().isEmpty()) {
                    existingDefaultAddress.setWard(newAddress.getWard());
                }
                if (newAddress.getFullAddress() != null && !newAddress.getFullAddress().isEmpty()) {
                    existingDefaultAddress.setFullAddress(newAddress.getFullAddress());
                }
                if (newAddress.getPhone() != null && !newAddress.getPhone().isEmpty()) {
                    existingDefaultAddress.setPhone(newAddress.getPhone());
                }
            } else {
                // Nếu chưa có địa chỉ mặc định, thêm mới thành mặc định
                newAddress.setUser(currentUser);
                newAddress.setDefault(true);
                currentUser.getAddresses().add(newAddress);
            }
        }

        return userRepository.save(currentUser);
    }

    public void changePassword(Authentication authentication, String currentPassword, String newPassword) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        // 1. Xoá Cart (sẽ tự xoá CartItem nhờ cascade)
        Cart cart = cartRepository.findByUserId(user.getId());
        if (cart != null) {
            cartRepository.delete(cart);
        }

        // 2. Xoá Order (sẽ tự xoá OrderItem nhờ cascade)
        List<Order> orders = orderRepository.findByUserId(user.getId());
        if (!orders.isEmpty()) {
            orderRepository.deleteAll(orders);
        }

        // 3.1 Xoá Wishlist nếu tồn tại
        wishlistRepository.findByUserId(user.getId()).ifPresent(wishlistRepository::delete);

        // 3. Xoá Interact
//        interactRepository.deleteByUserId(user.getId().intValue());

        // 4. Address sẽ tự xoá nhờ cascade trong User

        // 5. Cuối cùng xoá User
        userRepository.delete(user);
    }

    public User updateUser(Long userId, User updatedUser) throws Exception {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with id: " + userId));

        // Cập nhật các trường cơ bản
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setGender(updatedUser.getGender());
        existingUser.setRole(updatedUser.getRole());

        // Cập nhật mật khẩu nếu có (và không rỗng)
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(existingUser);
    }
}
