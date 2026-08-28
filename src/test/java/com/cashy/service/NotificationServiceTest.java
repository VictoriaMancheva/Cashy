package com.cashy.service;

import com.cashy.dto.NotificationResponse;
import com.cashy.entity.Notification;
import com.cashy.entity.User;
import com.cashy.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock NotificationRepository notificationRepository;
    @Mock UserService userService;

    @InjectMocks NotificationService notificationService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        when(userService.getCurrentUser()).thenReturn(user);
    }

    @Test
    void getNotifications_returnsListForCurrentUser() {
        Notification n = buildNotification(1L, "Budget exceeded", false);
        when(notificationRepository.findByUserOrderByCreatedAtDesc(user)).thenReturn(List.of(n));

        List<NotificationResponse> result = notificationService.getNotifications();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getMessage()).isEqualTo("Budget exceeded");
        assertThat(result.get(0).getIsRead()).isFalse();
    }

    @Test
    void markAsRead_setsIsReadTrue() {
        Notification n = buildNotification(1L, "Goal completed", false);
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(n));
        when(notificationRepository.save(n)).thenReturn(n);

        NotificationResponse result = notificationService.markAsRead(1L);

        assertThat(result.getIsRead()).isTrue();
        verify(notificationRepository).save(n);
    }

    @Test
    void markAsRead_throwsWhenNotFound() {
        when(notificationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificationService.markAsRead(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("99");
    }

    @Test
    void markAsRead_throwsWhenAccessDenied() {
        User other = new User();
        other.setId(2L);
        Notification n = buildNotification(5L, "msg", false);
        n.setUser(other);

        when(notificationRepository.findById(5L)).thenReturn(Optional.of(n));

        assertThatThrownBy(() -> notificationService.markAsRead(5L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Access denied");
    }

    @Test
    void markAllAsRead_updatesAllUnread() {
        Notification n1 = buildNotification(1L, "msg1", false);
        Notification n2 = buildNotification(2L, "msg2", false);
        when(notificationRepository.findByUserAndIsRead(user, false)).thenReturn(List.of(n1, n2));

        notificationService.markAllAsRead();

        verify(notificationRepository).saveAll(List.of(n1, n2));
        assertThat(n1.getIsRead()).isTrue();
        assertThat(n2.getIsRead()).isTrue();
    }

    @Test
    void deleteNotification_throwsWhenAccessDenied() {
        User other = new User();
        other.setId(2L);
        Notification n = buildNotification(3L, "msg", false);
        n.setUser(other);

        when(notificationRepository.findById(3L)).thenReturn(Optional.of(n));

        assertThatThrownBy(() -> notificationService.deleteNotification(3L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Access denied");
    }

    @Test
    void deleteNotification_deletesWhenOwner() {
        Notification n = buildNotification(4L, "msg", false);
        when(notificationRepository.findById(4L)).thenReturn(Optional.of(n));

        notificationService.deleteNotification(4L);

        verify(notificationRepository).delete(n);
    }

    @Test
    void createNotification_savesWithCorrectFields() {
        Notification saved = buildNotification(1L, "Hello", false);
        when(notificationRepository.save(any())).thenReturn(saved);

        Notification result = notificationService.createNotification(user, "Hello");

        assertThat(result.getMessage()).isEqualTo("Hello");
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void getUnreadCount_returnsCount() {
        when(notificationRepository.countByUserAndIsRead(user, false)).thenReturn(3L);

        long count = notificationService.getUnreadCount();

        assertThat(count).isEqualTo(3);
    }

    private Notification buildNotification(Long id, String message, boolean isRead) {
        Notification n = new Notification();
        n.setId(id);
        n.setMessage(message);
        n.setIsRead(isRead);
        n.setUser(user);
        return n;
    }
}
