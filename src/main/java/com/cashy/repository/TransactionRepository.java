package com.cashy.repository;

import com.cashy.entity.Category;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByDateDesc(User user);

    List<Transaction> findByUserAndTypeOrderByDateDesc(User user, Transaction.TransactionType type);

    List<Transaction> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate from, LocalDate to);

    List<Transaction> findByUserAndCategoryOrderByDateDesc(User user, Category category);
}
