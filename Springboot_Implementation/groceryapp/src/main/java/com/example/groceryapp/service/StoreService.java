package com.example.groceryapp.service;

import com.example.groceryapp.entity.Store;
import com.example.groceryapp.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;

    // CREATE
    public Store createStore(Store store) {
        return storeRepository.save(store);
    }

    // READ ALL
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    // READ BY ID
    public Optional<Store> getStoreById(Integer id) {
        return storeRepository.findById(id);
    }

    // UPDATE
    public Store updateStore(Integer id, Store storeDetails) {

        Store store = storeRepository.findById(id).orElse(null);

        if (store != null) {
            store.setStoreName(storeDetails.getStoreName());
            store.setStoreAddress(storeDetails.getStoreAddress());
            store.setStoreContact(storeDetails.getStoreContact());

            return storeRepository.save(store);
        }

        return null;
    }

    // DELETE
    public void deleteStore(Integer id) {
        storeRepository.deleteById(id);
    }

    // SEARCH BY NAME
    public List<Store> searchByName(String name) {
        return storeRepository.findByStoreNameContaining(name);
    }

    // SEARCH BY LOCATION (ADDRESS)
    public List<Store> searchByLocation(String location) {
        return storeRepository.findByStoreAddressContaining(location);
    }
}