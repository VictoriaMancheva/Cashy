package com.cashy.service;

import com.cashy.entity.Notification;
import com.cashy.entity.User;
import com.cashy.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceAdminAlertTest {

    @Mock NotificationRepository notificationRepository;
    @Mock UserService userService;

    @InjectMocks NotificationService notificationService;

    @Test
    void notifyAdmins_sendsUrgentNotificationToEveryAdmin() {
        User firstAdmin = buildAdmin(1L);
        User secondAdmin = buildAdmin(2L);
        when(userService.getUsersByRole(User.Role.ADMIN)).thenReturn(List.of(firstAdmin, secondAdmin));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));

        notificationService.notifyAdmins("URGENT – payment problem");

        ArgumentCaptor<Notification> captor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository, times(2)).save(captor.capture());
        assertThat(captor.getAllValues())
                .allSatisfy(n -> {
                    assertThat(n.getPriority()).isEqualTo(Notification.Priority.URGENT);
                    assertThat(n.getMessage()).isEqualTo("URGENT – payment problem");
                    assertThat(n.getIsRead()).isFalse();
                })
                .extracting(Notification::getUser)
                .containsExactly(firstAdmin, secondAdmin);
    }

    @Test
    void notifyAdmins_withNoAdmins_savesNothing() {
        when(userService.getUsersByRole(User.Role.ADMIN)).thenReturn(List.of());

        notificationService.notifyAdmins("URGENT – payment problem");

        verify(notificationRepository, never()).save(any());
    }

    @Test
    void createNotification_defaultsToNormalPriority() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));

        Notification result = notificationService.createNotification(buildAdmin(1L), "Budget exceeded");

        assertThat(result.getPriority()).isEqualTo(Notification.Priority.NORMAL);
    }

    private User buildAdmin(Long id) {
        User user = new User();
        user.setId(id);
        user.setRole(User.Role.ADMIN);
        return user;
    }
}
