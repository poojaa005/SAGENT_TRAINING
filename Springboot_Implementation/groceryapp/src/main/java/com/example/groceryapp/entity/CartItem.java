package com.example.groceryapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_item")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cartItemId;

    private Integer quantity;

    private Double price;

    // Many CartItems → One Cart
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    // Many CartItems → One Product
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Default Constructor
    public CartItem() {
    }

    // Parameterized Constructor
    public CartItem(Integer cartItemId, Integer quantity,
                    Double price, Cart cart, Product product) {
        this.cartItemId = cartItemId;
        this.quantity = quantity;
        this.price = price;
        this.cart = cart;
        this.product = product;
    }

    // Getters and Setters

    public Integer getCartItemId() {
        return cartItemId;
    }

    public void setCartItemId(Integer cartItemId) {
        this.cartItemId = cartItemId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}