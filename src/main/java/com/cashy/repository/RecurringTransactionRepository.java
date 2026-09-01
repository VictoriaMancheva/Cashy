package com.cashy.repository;

import com.cashy.entity.RecurringTransaction;
import com.cashy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {

    List<RecurringTransaction> findByUserOrderByNextDateAsc(User user);

    List<RecurringTransaction> findByNextDateLessThanEqualOrderByNextDateAsc(LocalDate date);

    List<RecurringTransaction> findByNextDate(LocalDate date);
}
