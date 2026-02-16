package com.example.groceryapp.service;

import com.example.groceryapp.entity.Notification;
import com.example.groceryapp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    // Create
    public Notification saveNotification(Notification notification) {
        return repository.save(notification);
    }

    // Get All
    public List<Notification> getAllNotifications() {
        return repository.findAll();
    }

    // Get by ID
    public Optional<Notification> getById(Long id) {
        return repository.findById(id);
    }

    // Get by UserId
    public List<Notification> getByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    // Get by Read Status
    public List<Notification> getByReadStatus(Boolean isRead) {
        return repository.findByIsRead(isRead);
    }

    // Update (Mark as Read)
    public Notification updateNotification(Long id, Notification details) {
        Notification notification = repository.findById(id).orElseThrow();
        notification.setTitle(details.getTitle());
        notification.setMessage(details.getMessage());
        notification.setIsRead(details.getIsRead());
        return repository.save(notification);
    }

    // Delete
    public void deleteNotification(Long id) {
        repository.deleteById(id);
    }
}