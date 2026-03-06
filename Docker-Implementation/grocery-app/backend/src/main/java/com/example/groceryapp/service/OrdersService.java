package com.example.groceryapp.service;

import com.example.groceryapp.entity.Orders;
import com.example.groceryapp.repository.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdersService {

    @Autowired
    private OrdersRepository ordersRepository;

    // Create
    public Orders saveOrder(Orders order) {
        return ordersRepository.save(order);
    }

    // Read All
    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    // Read By ID
    public Optional<Orders> getOrderById(Long id) {
        return ordersRepository.findById(id);
    }

    // Read By UserId
    public List<Orders> getOrdersByUserId(Long userId) {
        return ordersRepository.findByUserId(userId);
    }

    // Update
    public Orders updateOrder(Long id, Orders orderDetails) {

        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setUserId(orderDetails.getUserId());
        order.setTotalAmount(orderDetails.getTotalAmount());
        order.setStatus(orderDetails.getStatus()); // ✅ fixed

        return ordersRepository.save(order);
    }

    // Delete
    public void deleteOrder(Long id) {
        ordersRepository.deleteById(id);
    }
}
