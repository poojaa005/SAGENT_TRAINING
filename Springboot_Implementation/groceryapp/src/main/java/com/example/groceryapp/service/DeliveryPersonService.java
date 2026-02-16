package com.example.groceryapp.service;

import com.example.groceryapp.entity.DeliveryPerson;
import com.example.groceryapp.repository.DeliveryPersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryPersonService {

    @Autowired
    private DeliveryPersonRepository repository;

    // Create
    public DeliveryPerson saveDeliveryPerson(DeliveryPerson dp) {
        return repository.save(dp);
    }

    // Read All
    public List<DeliveryPerson> getAllDeliveryPersons() {
        return repository.findAll();
    }

    // Search by ID
    public Optional<DeliveryPerson> getById(Long id) {
        return repository.findById(id);
    }

    // Search by Name
    public List<DeliveryPerson> getByName(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }

    // Search by Phone
    public List<DeliveryPerson> getByPhone(String phone) {
        return repository.findByPhone(phone);
    }

    // Update
    public DeliveryPerson updateDeliveryPerson(Long id, DeliveryPerson details) {
        DeliveryPerson dp = repository.findById(id).orElseThrow();
        dp.setName(details.getName());
        dp.setPhone(details.getPhone());
        dp.setVehicleNumber(details.getVehicleNumber());
        dp.setStatus(details.getStatus());
        return repository.save(dp);
    }

    // Delete
    public void deleteDeliveryPerson(Long id) {
        repository.deleteById(id);
    }
}