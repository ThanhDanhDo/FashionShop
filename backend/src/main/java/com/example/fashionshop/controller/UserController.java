package com.example.fashionshop.controller;

import com.example.fashionshop.model.Address;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.AddressRepository;
import com.example.fashionshop.response.ApiResponse;
import com.example.fashionshop.service.AddressService;
import com.example.fashionshop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AddressService addressService;

    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUserHandler(Authentication authentication) throws Exception {
        User user = userService.getCurrentUserProfile(authentication);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/edit")
    public ResponseEntity<User> updateCurrentUserHandler(Authentication authentication, @RequestBody User updatedUser) throws Exception {
        User user = userService.updateCurrentUserProfile(authentication, updatedUser);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<Address>> getListOfAddressForCurrentUserHandler (Authentication authentication) throws Exception {
        String email = authentication.getName();
        List<Address> addresses = addressService.getAddressByUserEmail(email);
        return ResponseEntity.ok(addresses != null ? addresses : new ArrayList<>());
    }

    @PostMapping("/addresses/add")
    public ResponseEntity<Address> addAddressForCurrentUserHandler(Authentication authentication, @RequestBody Address newAddress) throws Exception {
        String email = authentication.getName();
        Address addedAddress = addressService.addAddress(email, newAddress);

        return ResponseEntity.status(HttpStatus.CREATED).body(addedAddress);
    }

    @DeleteMapping("/addresses/delete/{addressId}")
    public ResponseEntity<Void> deleteAddressForCurrentUserHandler(Authentication authentication, @PathVariable Long addressId) throws Exception {
        String email = authentication.getName();
        addressService.deleteAddress(email, addressId);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/addresses/update/{addressId}")
    public ResponseEntity<ApiResponse> updateAddressForCurrentUserHandler(Authentication authentication, @PathVariable Long addressId, @RequestBody Address updatedAddress) throws Exception {
        String email = authentication.getName();
        Address address = addressService.updateAddress(email, addressId, updatedAddress);
        return new ResponseEntity<>(new ApiResponse("Cập nhật thành công", true, address), HttpStatus.OK);
    }


}
