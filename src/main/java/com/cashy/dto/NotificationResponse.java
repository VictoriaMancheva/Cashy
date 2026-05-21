package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
