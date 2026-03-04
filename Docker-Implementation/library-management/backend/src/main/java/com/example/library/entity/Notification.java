package com.example.library.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    private String message;

    private LocalDateTime createdAt;

    private boolean isRead;

    // Many Notifications -> One Member
    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    public Notification() {
    }

    public Notification(String message, LocalDateTime createdAt, boolean isRead, Member member) {
        this.message = message;
        this.createdAt = createdAt;
        this.isRead = isRead;
        this.member = member;
    }

    // Getters & Setters

    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }
}
