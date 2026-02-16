package com.example.groceryapp.controller;

import com.example.groceryapp.entity.OrderItems;
import com.example.groceryapp.service.OrderItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin("*")
public class OrderItemsController {

    @Autowired
    private OrderItemsService orderItemsService;

    // Create
    @PostMapping
    public OrderItems createOrderItem(@RequestBody OrderItems item) {
        return orderItemsService.saveOrderItem(item);
    }

    // Get All
    @GetMapping
    public List<OrderItems> getAllOrderItems() {
        return orderItemsService.getAllOrderItems();
    }

    // Get by ID
    @GetMapping("/{id}")
    public Optional<OrderItems> getOrderItemById(@PathVariable Long id) {
        return orderItemsService.getOrderItemById(id);
    }

    // Get by OrderId
    @GetMapping("/order/{orderId}")
    public List<OrderItems> getItemsByOrderId(@PathVariable Long orderId) {
        return orderItemsService.getItemsByOrderId(orderId);
    }

    // Update
    @PutMapping("/{id}")
    public OrderItems updateOrderItem(@PathVariable Long id,
                                      @RequestBody OrderItems item) {
        return orderItemsService.updateOrderItem(id, item);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteOrderItem(@PathVariable Long id) {
        orderItemsService.deleteOrderItem(id);
        return "Order item deleted successfully!";
    }
}