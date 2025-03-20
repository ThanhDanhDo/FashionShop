package com.example.fashionshop.service;

import com.example.fashionshop.model.User;
import com.example.fashionshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {
    final UserRepository userRepository;

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
        if (updatedUser.getFistName()!=null){
            currentUser.setFistName(updatedUser.getFistName());
        }
        if (updatedUser.getLastName()!=null){
            currentUser.setLastName(updatedUser.getLastName());
        }

        return userRepository.save(currentUser);
    }
}
