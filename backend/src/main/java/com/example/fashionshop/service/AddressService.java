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
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        // Kiểm tra user đã có địa chỉ nào chưa
        boolean hasAddress = addressRepository.existsByUser(user);
        if (!hasAddress) {
            newAddress.setDefault(true); // chưa có địa chỉ => set mặc định
        } else {
            newAddress.setDefault(false); // đã có địa chỉ => không set mặc định
        }
        newAddress.setUser(user);
        return addressRepository.save(newAddress);
    }

    public Address getAddressById(Long id) {
        Optional<Address> address = addressRepository.findById(id);
        if (address.isPresent()) {
            return address.get();
        }
        return null;
    }

    public Address getAddressDefaultOfUser (User user) {
        Address address = addressRepository.findByUserAndIsDefaultTrue(user).orElse(null);
        return address;
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

    public void deleteAddressByAdmin(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new IllegalArgumentException("Address not found."));
        if (!address.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Address does not belong to the specified user.");
        }
        addressRepository.delete(address);
    }

    public Address updateAddressByAdmin(Long userId, Long addressId, Address updatedAddress) {
        Address existingAddress = addressRepository.findById(addressId)
            .orElseThrow(() -> new IllegalArgumentException("Address not found."));
        if (!existingAddress.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Address does not belong to the specified user.");
        }
        if (updatedAddress.isDefault()) {
            List<Address> userAddresses = addressRepository.findByUser_Id(userId);
            for (Address addr : userAddresses) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
            existingAddress.setDefault(true);
        }
        if (updatedAddress.getProvince() != null) existingAddress.setProvince(updatedAddress.getProvince());
        if (updatedAddress.getDistrict() != null) existingAddress.setDistrict(updatedAddress.getDistrict());
        if (updatedAddress.getWard() != null) existingAddress.setWard(updatedAddress.getWard());
        if (updatedAddress.getFullAddress() != null) existingAddress.setFullAddress(updatedAddress.getFullAddress());
        if (updatedAddress.getPhone() != null) existingAddress.setPhone(updatedAddress.getPhone());
        return addressRepository.save(existingAddress);
    }

    public Address addAddressByAdmin(Long userId, Address newAddress) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        newAddress.setUser(user);
        // Nếu là default thì bỏ default các address khác
        if (newAddress.isDefault()) {
            List<Address> userAddresses = addressRepository.findByUser_Id(userId);
            for (Address addr : userAddresses) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        }
        return addressRepository.save(newAddress);
    }




}
