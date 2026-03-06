package com.example.groceryapp.service;

import com.example.groceryapp.entity.OrderItems;
import com.example.groceryapp.repository.OrderItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemsService {

    @Autowired
    private OrderItemsRepository orderItemsRepository;

    // Create
    public OrderItems saveOrderItem(OrderItems item) {
        return orderItemsRepository.save(item);
    }

    // Read All
    public List<OrderItems> getAllOrderItems() {
        return orderItemsRepository.findAll();
    }

    // Read by ID
    public Optional<OrderItems> getOrderItemById(Long id) {
        return orderItemsRepository.findById(id);
    }

    // Read by OrderId
    public List<OrderItems> getItemsByOrderId(Long orderId) {
        return orderItemsRepository.findByOrder_OrderId(orderId);
    }

    // Update
    public OrderItems updateOrderItem(Long id, OrderItems itemDetails) {
        OrderItems item = orderItemsRepository.findById(id).orElseThrow();
        item.setProductId(itemDetails.getProductId());
        item.setQuantity(itemDetails.getQuantity());
        item.setPrice(itemDetails.getPrice());
        return orderItemsRepository.save(item);
    }

    // Delete
    public void deleteOrderItem(Long id) {
        orderItemsRepository.deleteById(id);
    }
}