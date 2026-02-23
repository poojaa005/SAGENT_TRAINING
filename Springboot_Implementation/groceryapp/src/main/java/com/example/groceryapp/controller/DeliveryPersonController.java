package com.example.groceryapp.controller;

import com.example.groceryapp.entity.DeliveryPerson;
import com.example.groceryapp.service.DeliveryPersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/delivery-person")
@CrossOrigin("*")
public class DeliveryPersonController {

    @Autowired
    private DeliveryPersonService service;

    // Create
    @PostMapping
    public DeliveryPerson create(@RequestBody DeliveryPerson dp) {
        return service.saveDeliveryPerson(dp);
    }

    // Get All
    @GetMapping
    public List<DeliveryPerson> getAll() {
        return service.getAllDeliveryPersons();
    }

    // Search by ID
    @GetMapping("/{id}")
    public Optional<DeliveryPerson> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // Search by Name
    @GetMapping("/search/name/{name}")
    public List<DeliveryPerson> getByName(@PathVariable String name) {
        return service.getByName(name);
    }

    // Search by Phone
    @GetMapping("/search/phone/{phone}")
    public List<DeliveryPerson> getByPhone(@PathVariable String phone) {
        return service.getByPhone(phone);
    }

    // Update
    @PutMapping("/{id}")
    public DeliveryPerson update(@PathVariable Long id,
                                 @RequestBody DeliveryPerson dp) {
        return service.updateDeliveryPerson(id, dp);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteDeliveryPerson(id);
        return "Delivery Person deleted successfully!";
    }
}