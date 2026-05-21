package com.cashy.repository;

import com.cashy.entity.Notification;
import com.cashy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserAndIsRead(User user, Boolean isRead);

    long countByUserAndIsRead(User user, Boolean isRead);
}
