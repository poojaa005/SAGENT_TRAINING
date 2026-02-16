package com.example.groceryapp.repository;

import com.example.groceryapp.entity.DeliveryPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryPersonRepository extends JpaRepository<DeliveryPerson, Long> {

    List<DeliveryPerson> findByNameContainingIgnoreCase(String name);

    List<DeliveryPerson> findByPhone(String phone);
}