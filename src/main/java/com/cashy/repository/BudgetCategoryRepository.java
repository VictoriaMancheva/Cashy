package com.cashy.repository;

import com.cashy.entity.Budget;
import com.cashy.entity.BudgetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetCategoryRepository extends JpaRepository<BudgetCategory, Long> {

    List<BudgetCategory> findByBudget(Budget budget);

    void deleteByBudget(Budget budget);
}
