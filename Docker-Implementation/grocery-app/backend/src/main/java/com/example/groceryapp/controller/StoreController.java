package com.example.groceryapp.controller;

import com.example.groceryapp.entity.Store;
import com.example.groceryapp.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/stores")
@CrossOrigin("*")
public class StoreController {

    @Autowired
    private StoreService storeService;

    // CREATE
    @PostMapping
    public Store createStore(@RequestBody Store store) {
        return storeService.createStore(store);
    }

    // READ ALL
    @GetMapping
    public List<Store> getAllStores() {
        return storeService.getAllStores();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Optional<Store> getStoreById(@PathVariable Integer id) {
        return storeService.getStoreById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Store updateStore(@PathVariable Integer id,
                             @RequestBody Store store) {
        return storeService.updateStore(id, store);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteStore(@PathVariable Integer id) {
        storeService.deleteStore(id);
        return "Store deleted successfully!";
    }

    // SEARCH BY NAME
    @GetMapping("/search/name/{name}")
    public List<Store> searchByName(@PathVariable String name) {
        return storeService.searchByName(name);
    }

    // SEARCH BY LOCATION
    @GetMapping("/search/location/{location}")
    public List<Store> searchByLocation(@PathVariable String location) {
        return storeService.searchByLocation(location);
    }
}