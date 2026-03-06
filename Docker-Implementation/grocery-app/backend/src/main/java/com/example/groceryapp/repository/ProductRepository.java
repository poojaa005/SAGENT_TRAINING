package com.example.groceryapp.repository;

import com.example.groceryapp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Exact name search
    List<Product> findByProductName(String productName);

    // Partial search
    List<Product> findByProductNameContaining(String productName);
}