package com.example.groceryapp.controller;

import com.example.groceryapp.entity.Orders;
import com.example.groceryapp.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrdersController {

    @Autowired
    private OrdersService ordersService;

    // Create Order
    @PostMapping
    public Orders createOrder(@RequestBody Orders order) {
        return ordersService.saveOrder(order);
    }

    // Get All Orders
    @GetMapping
    public List<Orders> getAllOrders() {
        return ordersService.getAllOrders();
    }

    // Get Order by ID
    @GetMapping("/{id}")
    public Optional<Orders> getOrderById(@PathVariable Long id) {
        return ordersService.getOrderById(id);
    }

    // Get Orders by UserId
    @GetMapping("/user/{userId}")
    public List<Orders> getOrdersByUserId(@PathVariable Long userId) {
        return ordersService.getOrdersByUserId(userId);
    }

    // Update Order
    @PutMapping("/{id}")
    public Orders updateOrder(@PathVariable Long id, @RequestBody Orders order) {
        return ordersService.updateOrder(id, order);
    }

    // Delete Order
    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        ordersService.deleteOrder(id);
        return "Order deleted successfully!";
    }
}