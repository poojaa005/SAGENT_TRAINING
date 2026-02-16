package com.example.groceryapp.controller;

import com.example.groceryapp.entity.Cart;
import com.example.groceryapp.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/carts")
@CrossOrigin("*")
public class CartController {

    @Autowired
    private CartService cartService;

    // CREATE
    @PostMapping
    public Cart createCart(@RequestBody Cart cart) {
        return cartService.createCart(cart);
    }

    // READ ALL
    @GetMapping
    public List<Cart> getAllCarts() {
        return cartService.getAllCarts();
    }

    // READ BY CART ID
    @GetMapping("/{cartId}")
    public Optional<Cart> getCartById(@PathVariable Integer cartId) {
        return cartService.getCartById(cartId);
    }

    // READ BY USER ID
    @GetMapping("/user/{userId}")
    public Optional<Cart> getCartByUserId(@PathVariable Integer userId) {
        return cartService.getCartByUserId(userId);
    }

    // UPDATE
    @PutMapping("/{cartId}")
    public Cart updateCart(@PathVariable Integer cartId,
                           @RequestBody Cart cart) {
        return cartService.updateCart(cartId, cart);
    }

    // DELETE
    @DeleteMapping("/{cartId}")
    public String deleteCart(@PathVariable Integer cartId) {
        cartService.deleteCart(cartId);
        return "Cart deleted successfully!";
    }
}