package com.cashy.service;

import com.cashy.dto.NotificationResponse;
import com.cashy.entity.Notification;
import com.cashy.entity.User;
import com.cashy.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    private static final String NOTIFICATION_NOT_FOUND = "Notification not found: %d";
    private static final String ACCESS_DENIED = "Access denied";

    public List<NotificationResponse> getNotifications() {
        User user = userService.getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    public long getUnreadCount() {
        User user = userService.getCurrentUser();
        return notificationRepository.countByUserAndIsRead(user, false);
    }

    public NotificationResponse markAsRead(Long id) {
        User user = userService.getCurrentUser();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(NOTIFICATION_NOT_FOUND, id)));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        notification.setIsRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    public void markAllAsRead() {
        User user = userService.getCurrentUser();
        List<Notification> unread = notificationRepository.findByUserAndIsRead(user, false);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(Long id) {
        User user = userService.getCurrentUser();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(NOTIFICATION_NOT_FOUND, id)));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        notificationRepository.delete(notification);
    }

    public Notification createNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        return notificationRepository.save(notification);
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(n.getId(), n.getMessage(), n.getIsRead(), n.getCreatedAt());
    }
}
