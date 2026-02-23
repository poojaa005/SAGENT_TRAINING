package com.example.groceryapp.repository;

import com.example.groceryapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    // Search by name
    List<User> findByName(String name);

    // Search by email
    Optional<User> findByEmail(String email);

    // Search by name containing (partial search)
    List<User> findByNameContaining(String name);
}
