package com.cashy.repository;

import com.cashy.entity.Goal;
import com.cashy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserOrderByDeadlineAsc(User user);

    List<Goal> findByDeadlineBetween(LocalDate from, LocalDate to);
}
