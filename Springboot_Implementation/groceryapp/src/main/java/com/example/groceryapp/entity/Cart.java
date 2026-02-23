package com.example.groceryapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cartId;

    private Double totalAmount;

    private Double discount;

    // One Cart belongs to One User
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Default Constructor
    public Cart() {
    }

    // Parameterized Constructor
    public Cart(Integer cartId, Double totalAmount,
                Double discount, User user) {

        this.cartId = cartId;
        this.totalAmount = totalAmount;
        this.discount = discount;
        this.user = user;
    }

    // Getters and Setters

    public Integer getCartId() {
        return cartId;
    }

    public void setCartId(Integer cartId) {
        this.cartId = cartId;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}