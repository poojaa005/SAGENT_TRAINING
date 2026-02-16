package com.example.groceryapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    private String productName;

    private String productDescription;

    private Double productPrice;

    private Integer stockQuantity;

    private Double productOffer;

    private String category;

    // Many Products → One Store
    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;

    // Default Constructor
    public Product() {
    }

    // Parameterized Constructor
    public Product(Integer productId, String productName,
                   String productDescription, Double productPrice,
                   Integer stockQuantity, Double productOffer,
                   String category, Store store) {

        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.stockQuantity = stockQuantity;
        this.productOffer = productOffer;
        this.category = category;
        this.store = store;
    }

    // Getters and Setters

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public Double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Double productPrice) {
        this.productPrice = productPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Double getProductOffer() {
        return productOffer;
    }

    public void setProductOffer(Double productOffer) {
        this.productOffer = productOffer;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }
}