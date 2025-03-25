package com.example.fashionshop.service;

import com.example.fashionshop.model.Address;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.AddressRepository;
import com.example.fashionshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    final UserRepository userRepository;
    final AddressRepository addressRepository;

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

    public User updateCurrentUserProfile(Authentication authentication, User updatedUser) throws Exception{
        if (authentication == null || !authentication.isAuthenticated()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        if (updatedUser == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
        }

        //update
        if (updatedUser.getEmail()!=null){
            currentUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getGender()!=null){
            currentUser.setGender(updatedUser.getGender());
        }
        if (updatedUser.getFirstName()!=null){
            currentUser.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName()!=null){
            currentUser.setLastName(updatedUser.getLastName());
        }

        //địa chỉ
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
}
