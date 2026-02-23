package com.example.groceryapp.repository;

import com.example.groceryapp.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, Integer> {

    // Search by exact name
    List<Store> findByStoreName(String storeName);

    // Search by partial name
    List<Store> findByStoreNameContaining(String storeName);

    // Search by location (address)
    List<Store> findByStoreAddressContaining(String storeAddress);

    // Search by exact address
    List<Store> findByStoreAddress(String storeAddress);
}