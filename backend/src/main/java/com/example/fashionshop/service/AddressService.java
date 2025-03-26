package com.example.fashionshop.service;


import com.example.fashionshop.model.Address;
import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.AddressRepository;
import com.example.fashionshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<Address> getAddressByUserEmail (String email) {
        return addressRepository.findByUser_Email(email);
    }

    public Address addAddress(String email, Address newAddress) {
        User user = userRepository.findByEmail(email);
        newAddress.setUser(user);
        newAddress.setDefault(false);
        return addressRepository.save(newAddress);
    }

    public Address updateAddress(String email, Long addressId, Address updatedAddress) {
        User user = userRepository.findByEmail(email);

        // Tìm địa chỉ cần cập nhật bằng ID (hoặc một thuộc tính khác, nếu cần)
        Address existingAddress = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found with ID: " + updatedAddress.getId()));

        // Kiểm tra xem địa chỉ có thuộc về người dùng hiện tại không
        if (!existingAddress.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("Address does not belong to the current user.");
        }

        if (updatedAddress.isDefault()) {
            // Đảm bảo chỉ có một địa chỉ mặc định
            List<Address> userAddresses = addressRepository.findByUser_Id(user.getId());
            for (Address addr : userAddresses) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
            existingAddress.setDefault(true);
        }
        if (updatedAddress.getProvince() != null) {
            existingAddress.setProvince(updatedAddress.getProvince());
        }
        if (updatedAddress.getDistrict() != null) {
            existingAddress.setDistrict(updatedAddress.getDistrict());
        }
        if (updatedAddress.getWard() != null) {
            existingAddress.setWard(updatedAddress.getWard());
        }
        if (updatedAddress.getFullAddress() != null) {
            existingAddress.setFullAddress(updatedAddress.getFullAddress());
        }
        if (updatedAddress.getPhone() != null) {
            existingAddress.setPhone(updatedAddress.getPhone());
        }

        return addressRepository.save(existingAddress);
    }

    public void deleteAddress(String email, Long addressId) {
        Optional<Address> address = addressRepository.findById(addressId);
        if (address.isEmpty()) {
            throw new IllegalArgumentException("Address not found.");
        }

        Address addressToDelete = address.get();

        // Kiểm tra xem địa chỉ có thuộc về người dùng hiện tại không
        if (!addressToDelete.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("Address does not belong to the current user.");
        }

        addressRepository.delete(addressToDelete);
    }




}
