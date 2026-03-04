package com.example.library.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.entity.Member;
import com.example.library.entity.Notification;
import com.example.library.repository.MemberRepository;
import com.example.library.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private MemberRepository memberRepository;

    // ✅ Create Notification
    public Notification createNotification(Long memberId, String message) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notification.setMember(member);

        return notificationRepository.save(notification);
    }

    // ✅ GET MEMBER NOTIFICATIONS (THIS IS MISSING IN YOUR CODE)
    public List<Notification> getMemberNotifications(Long memberId) {
        return notificationRepository.findByMember_MemberId(memberId);
    }

    // ✅ Mark as Read
    public Notification markAsRead(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);

        return notificationRepository.save(notification);
    }

    // ✅ Delete
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
