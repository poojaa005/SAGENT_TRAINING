package com.example.groceryapp.controller;

import com.example.groceryapp.entity.User;
import com.example.groceryapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    // CREATE
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // READ ALL
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Integer id,
                           @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return "User deleted successfully!";
    }

    // SEARCH BY NAME
    @GetMapping("/search/name/{name}")
    public List<User> searchByName(@PathVariable String name) {
        return userService.searchByName(name);
    }

    // SEARCH BY EMAIL
    @GetMapping("/search/email/{email}")
    public Optional<User> searchByEmail(@PathVariable String email) {
        return userService.searchByEmail(email);
    }
}
