package com.example.groceryapp.repository;

import com.example.groceryapp.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    // Get items by Cart ID
    List<CartItem> findByCart_CartId(Integer cartId);

    // Get items by Product ID
    List<CartItem> findByProduct_ProductId(Integer productId);
}