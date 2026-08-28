package com.cashy.service;

import com.cashy.dto.CategoryBreakdownResponse;
import com.cashy.dto.MonthlyBreakdownResponse;
import com.cashy.entity.Category;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import com.cashy.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock TransactionRepository transactionRepository;
    @Mock UserService userService;

    @InjectMocks AnalyticsService analyticsService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        when(userService.getCurrentUser()).thenReturn(user);
    }

    @Test
    void getMonthlyBreakdown_alwaysReturns12Entries() {
        when(transactionRepository.findByUserAndDateBetweenOrderByDateDesc(eq(user), any(), any()))
                .thenReturn(List.of());

        List<MonthlyBreakdownResponse> result = analyticsService.getMonthlyBreakdown();

        assertThat(result).hasSize(12);
    }

    @Test
    void getMonthlyBreakdown_aggregatesIncomeAndExpenses() {
        LocalDate today = LocalDate.now();

        Transaction income = buildTransaction(200.0, Transaction.TransactionType.INCOME, today);
        Transaction expense = buildTransaction(80.0, Transaction.TransactionType.EXPENSE, today);

        when(transactionRepository.findByUserAndDateBetweenOrderByDateDesc(eq(user), any(), any()))
                .thenReturn(List.of(income, expense));

        List<MonthlyBreakdownResponse> result = analyticsService.getMonthlyBreakdown();

        MonthlyBreakdownResponse current = result.get(result.size() - 1);
        assertThat(current.getIncome()).isEqualTo(200.0);
        assertThat(current.getExpenses()).isEqualTo(80.0);
    }

    @Test
    void getMonthlyBreakdown_fillsZeroForMonthsWithNoData() {
        when(transactionRepository.findByUserAndDateBetweenOrderByDateDesc(eq(user), any(), any()))
                .thenReturn(List.of());

        List<MonthlyBreakdownResponse> result = analyticsService.getMonthlyBreakdown();

        assertThat(result).allSatisfy(row -> {
            assertThat(row.getIncome()).isEqualTo(0.0);
            assertThat(row.getExpenses()).isEqualTo(0.0);
        });
    }

    @Test
    void getCategoryBreakdown_excludesIncomeTransactions() {
        LocalDate today = LocalDate.now();
        Category cat = buildCategory(1L, "Food");

        Transaction income = buildTransaction(500.0, Transaction.TransactionType.INCOME, today);
        income.setCategory(cat);
        Transaction expense = buildTransaction(100.0, Transaction.TransactionType.EXPENSE, today);
        expense.setCategory(cat);

        when(transactionRepository.findByUserAndDateBetweenOrderByDateDesc(eq(user), any(), any()))
                .thenReturn(List.of(income, expense));

        List<CategoryBreakdownResponse> result = analyticsService.getCategoryBreakdown(today.getMonthValue(), today.getYear());

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAmount()).isEqualTo(100.0);
    }

    @Test
    void getCategoryBreakdown_groupsByCategory() {
        LocalDate today = LocalDate.now();
        Category food = buildCategory(1L, "Food");
        Category transport = buildCategory(2L, "Transport");

        Transaction t1 = buildTransaction(50.0, Transaction.TransactionType.EXPENSE, today);
        t1.setCategory(food);
        Transaction t2 = buildTransaction(30.0, Transaction.TransactionType.EXPENSE, today);
        t2.setCategory(food);
        Transaction t3 = buildTransaction(20.0, Transaction.TransactionType.EXPENSE, today);
        t3.setCategory(transport);

        when(transactionRepository.findByUserAndDateBetweenOrderByDateDesc(eq(user), any(), any()))
                .thenReturn(List.of(t1, t2, t3));

        List<CategoryBreakdownResponse> result = analyticsService.getCategoryBreakdown(today.getMonthValue(), today.getYear());

        assertThat(result).hasSize(2);
        CategoryBreakdownResponse foodResult = result.stream()
                .filter(r -> r.getCategoryName().equals("Food"))
                .findFirst().orElseThrow();
        assertThat(foodResult.getAmount()).isEqualTo(80.0);
    }

    @Test
    void getCategoryBreakdown_sortsByAmountDescending() {
        LocalDate today = LocalDate.now();
        Category small = buildCategory(1L, "Small");
        Category large = buildCategory(2L, "Large");

        Transaction t1 = buildTransaction(10.0, Transaction.TransactionType.EXPENSE, today);
        t1.setCategory(small);
        Transaction t2 = buildTransaction(200.0, Transaction.TransactionType.EXPENSE, today);
        t2.setCategory(large);

        when(transactionRepository.findByUserAndDateBetweenOrderByDateDesc(eq(user), any(), any()))
                .thenReturn(List.of(t1, t2));

        List<CategoryBreakdownResponse> result = analyticsService.getCategoryBreakdown(today.getMonthValue(), today.getYear());

        assertThat(result.get(0).getCategoryName()).isEqualTo("Large");
        assertThat(result.get(1).getCategoryName()).isEqualTo("Small");
    }

    @Test
    void getCategoryBreakdown_returnsEmpty_whenNoExpenses() {
        when(transactionRepository.findByUserAndDateBetweenOrderByDateDesc(eq(user), any(), any()))
                .thenReturn(List.of());

        List<CategoryBreakdownResponse> result = analyticsService.getCategoryBreakdown(1, 2025);

        assertThat(result).isEmpty();
    }

    private Transaction buildTransaction(double amount, Transaction.TransactionType type, LocalDate date) {
        Transaction t = new Transaction();
        t.setAmount(amount);
        t.setType(type);
        t.setDate(date);
        t.setUser(user);
        return t;
    }

    private Category buildCategory(Long id, String name) {
        Category c = new Category();
        c.setId(id);
        c.setName(name);
        return c;
    }
}
