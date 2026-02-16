package com.example.groceryapp.controller;

import com.example.groceryapp.entity.CartItem;
import com.example.groceryapp.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart-items")
@CrossOrigin("*")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    // CREATE
    @PostMapping
    public CartItem addCartItem(@RequestBody CartItem cartItem) {
        return cartItemService.addCartItem(cartItem);
    }

    // READ ALL
    @GetMapping
    public List<CartItem> getAllCartItems() {
        return cartItemService.getAllCartItems();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Optional<CartItem> getCartItemById(@PathVariable Integer id) {
        return cartItemService.getCartItemById(id);
    }

    // GET BY CART ID
    @GetMapping("/cart/{cartId}")
    public List<CartItem> getItemsByCartId(@PathVariable Integer cartId) {
        return cartItemService.getItemsByCartId(cartId);
    }

    // GET BY PRODUCT ID
    @GetMapping("/product/{productId}")
    public List<CartItem> getItemsByProductId(@PathVariable Integer productId) {
        return cartItemService.getItemsByProductId(productId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public CartItem updateCartItem(@PathVariable Integer id,
                                   @RequestBody CartItem cartItem) {
        return cartItemService.updateCartItem(id, cartItem);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteCartItem(@PathVariable Integer id) {
        cartItemService.deleteCartItem(id);
        return "Cart Item deleted successfully!";
    }
}