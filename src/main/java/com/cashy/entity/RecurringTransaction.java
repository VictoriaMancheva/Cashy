package com.cashy.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "recurring_transactions")
public class RecurringTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private String description;

    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @Column(name = "next_date")
    private LocalDate nextDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public enum Frequency {
        WEEKLY, MONTHLY
    }
}