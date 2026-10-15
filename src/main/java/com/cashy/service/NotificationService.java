package com.cashy.service;

import com.cashy.dto.NotificationResponse;
import com.cashy.entity.Notification;
import com.cashy.entity.User;
import com.cashy.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

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
        return createNotification(user, message, Notification.Priority.NORMAL);
    }

    public Notification createNotification(User user, String message, Notification.Priority priority) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setPriority(priority);
        return notificationRepository.save(notification);
    }

    // Sends an URGENT notification to every admin. Runs in its own transaction so the alert
    // is kept even when the caller's transaction rolls back because of the problem it reports.
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void notifyAdmins(String message) {
        userService.getUsersByRole(User.Role.ADMIN)
                .forEach(admin -> createNotification(admin, message, Notification.Priority.URGENT));
    }

    private NotificationResponse toResponse(Notification n) {
        // Rows created before the priority column existed have no value
        Notification.Priority priority = n.getPriority() != null ? n.getPriority() : Notification.Priority.NORMAL;
        return new NotificationResponse(n.getId(), n.getMessage(), n.getIsRead(), n.getCreatedAt(), priority);
    }
}
