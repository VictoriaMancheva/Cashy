package com.cashy.repository;

import com.cashy.entity.DailyBudget;
import com.cashy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyBudgetRepository extends JpaRepository<DailyBudget, Long> {

    List<DailyBudget> findByUserOrderByDateDesc(User user);

    Optional<DailyBudget> findByUserAndDate(User user, LocalDate date);
}
