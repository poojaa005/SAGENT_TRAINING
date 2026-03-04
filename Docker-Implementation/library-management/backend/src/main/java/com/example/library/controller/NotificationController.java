package com.example.library.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.library.entity.Notification;
import com.example.library.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Create Notification
    @PostMapping("/{memberId}")
    public Notification createNotification(@PathVariable Long memberId,
                                           @RequestBody String message) {
        return notificationService.createNotification(memberId, message);
    }

    // Get Member Notifications
    @GetMapping("/{memberId}")
    public List<Notification> getMemberNotifications(@PathVariable Long memberId) {
        return notificationService.getMemberNotifications(memberId);
    }

    // Mark as Read
    @PutMapping("/read/{id}")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return "Notification deleted successfully";
    }
}
