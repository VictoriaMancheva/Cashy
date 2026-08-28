package com.cashy.service;

import com.cashy.dto.DashboardSummaryResponse;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import com.cashy.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock TransactionRepository transactionRepository;
    @Mock UserService userService;

    @InjectMocks DashboardService dashboardService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        when(userService.getCurrentUser()).thenReturn(user);
    }

    @Test
    void getSummary_returnsCorrectNetBalance() {
        when(transactionRepository.sumByUserAndType(user, Transaction.TransactionType.INCOME)).thenReturn(1000.0);
        when(transactionRepository.sumByUserAndType(user, Transaction.TransactionType.EXPENSE)).thenReturn(400.0);
        when(transactionRepository.sumByUserAndTypeAndDateRange(eq(user), eq(Transaction.TransactionType.INCOME), any(), any())).thenReturn(300.0);
        when(transactionRepository.sumByUserAndTypeAndDateRange(eq(user), eq(Transaction.TransactionType.EXPENSE), any(), any())).thenReturn(150.0);
        when(transactionRepository.findByUserOrderByDateDesc(eq(user), any(Pageable.class))).thenReturn(List.of());

        DashboardSummaryResponse result = dashboardService.getSummary();

        assertThat(result.getTotalIncome()).isEqualTo(1000.0);
        assertThat(result.getTotalExpenses()).isEqualTo(400.0);
        assertThat(result.getNetBalance()).isEqualTo(600.0);
    }

    @Test
    void getSummary_returnsCurrentMonthFigures() {
        when(transactionRepository.sumByUserAndType(user, Transaction.TransactionType.INCOME)).thenReturn(500.0);
        when(transactionRepository.sumByUserAndType(user, Transaction.TransactionType.EXPENSE)).thenReturn(200.0);
        when(transactionRepository.sumByUserAndTypeAndDateRange(eq(user), eq(Transaction.TransactionType.INCOME), any(), any())).thenReturn(120.0);
        when(transactionRepository.sumByUserAndTypeAndDateRange(eq(user), eq(Transaction.TransactionType.EXPENSE), any(), any())).thenReturn(80.0);
        when(transactionRepository.findByUserOrderByDateDesc(eq(user), any(Pageable.class))).thenReturn(List.of());

        DashboardSummaryResponse result = dashboardService.getSummary();

        assertThat(result.getCurrentMonthIncome()).isEqualTo(120.0);
        assertThat(result.getCurrentMonthExpenses()).isEqualTo(80.0);
    }

    @Test
    void getSummary_returnsRecentTransactions() {
        Transaction t1 = buildTransaction(50.0, Transaction.TransactionType.EXPENSE);
        Transaction t2 = buildTransaction(200.0, Transaction.TransactionType.INCOME);

        when(transactionRepository.sumByUserAndType(any(), any())).thenReturn(0.0);
        when(transactionRepository.sumByUserAndTypeAndDateRange(any(), any(), any(), any())).thenReturn(0.0);
        when(transactionRepository.findByUserOrderByDateDesc(eq(user), any(Pageable.class))).thenReturn(List.of(t1, t2));

        DashboardSummaryResponse result = dashboardService.getSummary();

        assertThat(result.getRecentTransactions()).hasSize(2);
    }

    @Test
    void getSummary_negativeNetBalance_whenExpensesExceedIncome() {
        when(transactionRepository.sumByUserAndType(user, Transaction.TransactionType.INCOME)).thenReturn(100.0);
        when(transactionRepository.sumByUserAndType(user, Transaction.TransactionType.EXPENSE)).thenReturn(250.0);
        when(transactionRepository.sumByUserAndTypeAndDateRange(any(), any(), any(), any())).thenReturn(0.0);
        when(transactionRepository.findByUserOrderByDateDesc(eq(user), any(Pageable.class))).thenReturn(List.of());

        DashboardSummaryResponse result = dashboardService.getSummary();

        assertThat(result.getNetBalance()).isNegative();
        assertThat(result.getNetBalance()).isEqualTo(-150.0);
    }

    private Transaction buildTransaction(double amount, Transaction.TransactionType type) {
        Transaction t = new Transaction();
        t.setId(1L);
        t.setAmount(amount);
        t.setType(type);
        t.setDate(LocalDate.now());
        t.setUser(user);
        return t;
    }
}
