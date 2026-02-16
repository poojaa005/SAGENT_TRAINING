package com.example.groceryapp.controller;

import com.example.groceryapp.entity.Notification;
import com.example.groceryapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
public class NotificationController {

    @Autowired
    private NotificationService service;

    // Create
    @PostMapping
    public Notification create(@RequestBody Notification notification) {
        return service.saveNotification(notification);
    }

    // Get All
    @GetMapping
    public List<Notification> getAll() {
        return service.getAllNotifications();
    }

    // Get by ID
    @GetMapping("/{id}")
    public Optional<Notification> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // Get by UserId
    @GetMapping("/user/{userId}")
    public List<Notification> getByUserId(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }

    // Get by Read Status
    @GetMapping("/status/{isRead}")
    public List<Notification> getByStatus(@PathVariable Boolean isRead) {
        return service.getByReadStatus(isRead);
    }

    // Update
    @PutMapping("/{id}")
    public Notification update(@PathVariable Long id,
                               @RequestBody Notification notification) {
        return service.updateNotification(id, notification);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteNotification(id);
        return "Notification deleted successfully!";
    }
}