package com.cashy.repository;

import com.cashy.entity.Category;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByDateDesc(User user);

    List<Transaction> findByUserAndTypeOrderByDateDesc(User user, Transaction.TransactionType type);

    List<Transaction> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate from, LocalDate to);

    List<Transaction> findByUserAndCategoryOrderByDateDesc(User user, Category category);

    List<Transaction> findByUserOrderByDateDesc(User user, Pageable pageable);

    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    Double sumByUserAndType(@Param("user") User user, @Param("type") Transaction.TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.user = :user AND t.type = :type AND t.date >= :startDate AND t.date <= :endDate")
    Double sumByUserAndTypeAndDateRange(@Param("user") User user, @Param("type") Transaction.TransactionType type, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.user = :user AND t.category = :category AND t.type = 'EXPENSE' AND t.date >= :startDate AND t.date <= :endDate")
    Double sumExpenseByUserAndCategoryAndDateRange(@Param("user") User user, @Param("category") Category category, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE' AND t.date = :date")
    Double sumExpenseByUserAndDate(@Param("user") User user, @Param("date") LocalDate date);
}
