package com.cashy.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    private Integer month;
    private Integer year;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}