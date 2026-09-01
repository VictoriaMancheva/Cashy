package com.cashy.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "target_amount")
    private Double targetAmount;

    @Column(name = "current_amount")
    private Double currentAmount = 0.0;

    private LocalDate deadline;

    @Column(name = "last_deadline_notification")
    private LocalDate lastDeadlineNotification;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}