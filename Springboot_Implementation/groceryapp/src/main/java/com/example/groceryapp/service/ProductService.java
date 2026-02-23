package com.example.groceryapp.service;

import com.example.groceryapp.entity.Product;
import com.example.groceryapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // CREATE
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // READ ALL
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // READ BY ID
    public Optional<Product> getProductById(Integer id) {
        return productRepository.findById(id);
    }

    // UPDATE
    public Product updateProduct(Integer id, Product productDetails) {

        Product product = productRepository.findById(id).orElse(null);

        if (product != null) {
            product.setProductName(productDetails.getProductName());
            product.setProductDescription(productDetails.getProductDescription());
            product.setProductPrice(productDetails.getProductPrice());
            product.setStockQuantity(productDetails.getStockQuantity());
            product.setProductOffer(productDetails.getProductOffer());
            product.setCategory(productDetails.getCategory());
            product.setStore(productDetails.getStore());

            return productRepository.save(product);
        }

        return null;
    }

    // DELETE
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }

    // SEARCH BY NAME
    public List<Product> searchByName(String name) {
        return productRepository.findByProductNameContaining(name);
    }
}