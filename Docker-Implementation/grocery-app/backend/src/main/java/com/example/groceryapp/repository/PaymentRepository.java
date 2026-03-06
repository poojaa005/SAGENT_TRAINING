package com.example.groceryapp.repository;

import com.example.groceryapp.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByOrder_OrderId(Long orderId);
}