package com.example.groceryapp.service;

import com.example.groceryapp.entity.User;
import com.example.groceryapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // CREATE
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // READ ALL
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // READ BY ID
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    // UPDATE
    public User updateUser(Integer id, User userDetails) {
        User user = userRepository.findById(id).orElse(null);

        if (user != null) {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPassword(userDetails.getPassword());
            user.setPhoneNo(userDetails.getPhoneNo());
            user.setAddress(userDetails.getAddress());
            user.setRole(userDetails.getRole());
            return userRepository.save(user);
        }
        return null;
    }

    // DELETE
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    // SEARCH BY NAME
    public List<User> searchByName(String name) {
        return userRepository.findByNameContaining(name);
    }

    // SEARCH BY EMAIL
    public Optional<User> searchByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
