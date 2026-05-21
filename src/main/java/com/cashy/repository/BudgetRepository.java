package com.cashy.repository;

import com.cashy.entity.Budget;
import com.cashy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserOrderByYearDescMonthDesc(User user);

    Optional<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);

    boolean existsByUserAndMonthAndYear(User user, Integer month, Integer year);
}
