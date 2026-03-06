package com.example.groceryapp.repository;

import com.example.groceryapp.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {

    // Access cart using userId
    Optional<Cart> findByUser_UserId(Integer userId);
}