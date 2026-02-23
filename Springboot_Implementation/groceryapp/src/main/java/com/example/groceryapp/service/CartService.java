package com.example.groceryapp.service;

import com.example.groceryapp.entity.Cart;
import com.example.groceryapp.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // CREATE
    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    // READ ALL
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    // READ BY CART ID
    public Optional<Cart> getCartById(Integer cartId) {
        return cartRepository.findById(cartId);
    }

    // READ BY USER ID
    public Optional<Cart> getCartByUserId(Integer userId) {
        return cartRepository.findByUser_UserId(userId);
    }

    // UPDATE
    public Cart updateCart(Integer cartId, Cart cartDetails) {

        Cart cart = cartRepository.findById(cartId).orElse(null);

        if (cart != null) {
            cart.setTotalAmount(cartDetails.getTotalAmount());
            cart.setDiscount(cartDetails.getDiscount());
            cart.setUser(cartDetails.getUser());

            return cartRepository.save(cart);
        }

        return null;
    }

    // DELETE
    public void deleteCart(Integer cartId) {
        cartRepository.deleteById(cartId);
    }
}