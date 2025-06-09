package com.example.fashionshop.controller;

import com.example.fashionshop.request.CreateUserWithAddressRequest;
import com.example.fashionshop.enums.Gender;
import com.example.fashionshop.enums.Role;
import com.example.fashionshop.model.Address;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.AddressRepository;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.request.ChangePasswordRequest;
import com.example.fashionshop.response.ApiResponse;
import com.example.fashionshop.service.AddressService;
import com.example.fashionshop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AddressService addressService;

    @GetMapping("/user/profile")
    public ResponseEntity<User> getCurrentUserHandler(Authentication authentication) throws Exception {
        User user = userService.getCurrentUserProfile(authentication);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/user/edit")
    public ResponseEntity<User> updateCurrentUserHandler(Authentication authentication, @RequestBody User updatedUser) throws Exception {
        User user = userService.updateCurrentUserProfile(authentication, updatedUser);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/addresses")
    public ResponseEntity<List<Address>> getListOfAddressForCurrentUserHandler (Authentication authentication) throws Exception {
        String email = authentication.getName();
        List<Address> addresses = addressService.getAddressByUserEmail(email);
        return ResponseEntity.ok(addresses != null ? addresses : new ArrayList<>());
    }

    @PostMapping("/user/addresses/add")
    public ResponseEntity<Address> addAddressForCurrentUserHandler(Authentication authentication, @RequestBody Address newAddress) throws Exception {
        String email = authentication.getName();
        Address addedAddress = addressService.addAddress(email, newAddress);

        return ResponseEntity.status(HttpStatus.CREATED).body(addedAddress);
    }

    @DeleteMapping("/user/addresses/delete/{addressId}")
    public ResponseEntity<Void> deleteAddressForCurrentUserHandler(Authentication authentication, @PathVariable Long addressId) throws Exception {
        String email = authentication.getName();
        addressService.deleteAddress(email, addressId);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user/addresses/update/{addressId}")
    public ResponseEntity<ApiResponse> updateAddressForCurrentUserHandler(Authentication authentication, @PathVariable Long addressId, @RequestBody Address updatedAddress) throws Exception {
        String email = authentication.getName();
        Address address = addressService.updateAddress(email, addressId, updatedAddress);
        return new ResponseEntity<>(new ApiResponse("Cập nhật thành công", true, address), HttpStatus.OK);
    }

    //Create User (ADMIN)
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/admin/users")
    public ResponseEntity<ApiResponse> createUser(@RequestBody User newUser) throws Exception {
        User createdUser = userService.createUser(newUser);
        return new ResponseEntity<>(new ApiResponse("User created successfully", true, createdUser), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(userService.getAllUser(pageable));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/searchUser")
    public ResponseEntity<?> searchUsers(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> userPage = userService.searchUser(firstName, email, pageable);

        List<Map<String, Object>> userList = userPage.getContent().stream().map(user -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", user.getId());
            map.put("firstName", user.getFirstName());
            map.put("lastName", user.getLastName());
            map.put("email", user.getEmail());
            map.put("gender", user.getGender());
            map.put("role", user.getRole());
            map.put("createdAt", user.getCreatedAt());
            // Lấy địa chỉ mặc định
            Address defaultAddr = null;
            if (user.getAddresses() != null) {
                defaultAddr = user.getAddresses().stream().filter(Address::isDefault).findFirst().orElse(null);
            }
            if (defaultAddr != null) {
                Map<String, Object> addressMap = new java.util.HashMap<>();
                addressMap.put("fullAddress", defaultAddr.getFullAddress());
                addressMap.put("phone", defaultAddr.getPhone());
                map.put("address", addressMap);
            } else {
                map.put("address", null);
            }
            return map;
        }).toList();

        return ResponseEntity.ok(java.util.Map.of(
                "content", userList,
                "totalElements", userPage.getTotalElements(),
                "number", userPage.getNumber(),
                "size", userPage.getSize()
        ));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) throws Exception {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/user/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(authentication, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(new ApiResponse("Password changed successfully", true, null));
    }

    @DeleteMapping("/user/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User with ID " + id + " deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/admin/users-with-address")
    public ResponseEntity<?> createUserWithAddress(@RequestBody CreateUserWithAddressRequest req) {
        // 1. Kiểm tra email đã tồn tại chưa
        if (userRepository.findByEmail(req.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Email already exists"));
        }

        // 2. Tạo user
        User user = new User();
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setGender(Gender.valueOf(req.getGender()));
        user.setRole(Role.valueOf(req.getRole()));
        User savedUser = userRepository.save(user);

        // 3. Tạo address mặc định
        Address address = new Address();
        address.setProvince(req.getProvince());
        address.setDistrict(req.getDistrict());
        address.setWard(req.getWard());
        address.setFullAddress(req.getFullAddress());
        address.setPhone(req.getPhone());
        address.setDefault(true);
        address.setUser(savedUser);
        addressRepository.save(address);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/users/{userId}/addresses")
    public ResponseEntity<List<Address>> getAddressesByUserId(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<Address> addresses = addressRepository.findByUser_Id(user.getId());
        return ResponseEntity.ok(addresses);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/admin/users/{userId}/addresses/{addressId}")
    public ResponseEntity<?> deleteAddressByAdmin(@PathVariable Long userId, @PathVariable Long addressId) {
        addressService.deleteAddressByAdmin(userId, addressId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/admin/users/{userId}/addresses/{addressId}")
    public ResponseEntity<Address> updateAddressByAdmin(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @RequestBody Address updatedAddress) {
        Address address = addressService.updateAddressByAdmin(userId, addressId, updatedAddress);
        return ResponseEntity.ok(address);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/admin/users/{userId}/addresses")
    public ResponseEntity<Address> addAddressByAdmin(@PathVariable Long userId, @RequestBody Address newAddress) {
        Address address = addressService.addAddressByAdmin(userId, newAddress);
        return ResponseEntity.status(HttpStatus.CREATED).body(address);
    }
}
