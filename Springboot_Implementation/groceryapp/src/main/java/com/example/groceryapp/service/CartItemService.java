package com.example.groceryapp.service;

import com.example.groceryapp.entity.CartItem;
import com.example.groceryapp.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    // CREATE
    public CartItem addCartItem(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    // READ ALL
    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    // READ BY ID
    public Optional<CartItem> getCartItemById(Integer id) {
        return cartItemRepository.findById(id);
    }

    // GET BY CART ID
    public List<CartItem> getItemsByCartId(Integer cartId) {
        return cartItemRepository.findByCart_CartId(cartId);
    }

    // GET BY PRODUCT ID
    public List<CartItem> getItemsByProductId(Integer productId) {
        return cartItemRepository.findByProduct_ProductId(productId);
    }

    // UPDATE
    public CartItem updateCartItem(Integer id, CartItem cartItemDetails) {

        CartItem cartItem = cartItemRepository.findById(id).orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(cartItemDetails.getQuantity());
            cartItem.setPrice(cartItemDetails.getPrice());
            cartItem.setCart(cartItemDetails.getCart());
            cartItem.setProduct(cartItemDetails.getProduct());

            return cartItemRepository.save(cartItem);
        }

        return null;
    }

    // DELETE
    public void deleteCartItem(Integer id) {
        cartItemRepository.deleteById(id);
    }
}