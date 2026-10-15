package com.cashy.service;

import com.cashy.dto.TodayBudgetResponse;
import com.cashy.entity.Budget;
import com.cashy.entity.DailyBudget;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import com.cashy.repository.BudgetRepository;
import com.cashy.repository.DailyBudgetRepository;
import com.cashy.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DailyBudgetServiceTest {

    @Mock DailyBudgetRepository dailyBudgetRepository;
    @Mock BudgetRepository budgetRepository;
    @Mock TransactionRepository transactionRepository;
    @Mock UserService userService;

    @InjectMocks DailyBudgetService dailyBudgetService;

    private User user;
    private LocalDate today;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        today = LocalDate.now();
        when(userService.getCurrentUser()).thenReturn(user);
    }

    @Test
    void getTodayBudget_manualLimitTakesPriority() {
        DailyBudget manual = new DailyBudget();
        manual.setDailyLimit(50.0);
        manual.setDate(today);
        manual.setUser(user);

        when(dailyBudgetRepository.findByUserAndDate(user, today)).thenReturn(Optional.of(manual));
        when(transactionRepository.sumExpenseByUserAndDate(user, today)).thenReturn(20.0);

        TodayBudgetResponse result = dailyBudgetService.getTodayBudget();

        assertThat(result.getSource()).isEqualTo(TodayBudgetResponse.Source.MANUAL);
        assertThat(result.getDailyLimit()).isEqualTo(50.0);
        assertThat(result.getSpentToday()).isEqualTo(20.0);
        assertThat(result.getRemainingToday()).isEqualTo(30.0);
    }

    @Test
    void getTodayBudget_calculatedFromMonthlyBudgetWhenNoManual() {
        int daysInMonth = today.lengthOfMonth();
        int dayOfMonth = today.getDayOfMonth();
        int remainingDays = daysInMonth - dayOfMonth + 1;

        Budget budget = new Budget();
        budget.setTotalAmount(300.0);
        budget.setMonth(today.getMonthValue());
        budget.setYear(today.getYear());
        budget.setUser(user);

        when(dailyBudgetRepository.findByUserAndDate(user, today)).thenReturn(Optional.empty());
        when(budgetRepository.findByUserAndMonthAndYear(user, today.getMonthValue(), today.getYear()))
                .thenReturn(Optional.of(budget));
        when(transactionRepository.sumExpenseByUserAndDate(user, today)).thenReturn(10.0);

        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate yesterday = today.minusDays(1);
        if (!yesterday.isBefore(startOfMonth)) {
            when(transactionRepository.sumByUserAndTypeAndDateRange(
                    eq(user), eq(Transaction.TransactionType.EXPENSE), eq(startOfMonth), eq(yesterday)))
                    .thenReturn(60.0);
        }

        TodayBudgetResponse result = dailyBudgetService.getTodayBudget();

        assertThat(result.getSource()).isEqualTo(TodayBudgetResponse.Source.CALCULATED);
        double expectedLimit = (300.0 - (dayOfMonth == 1 ? 0.0 : 60.0)) / remainingDays;
        assertThat(result.getDailyLimit()).isEqualTo(expectedLimit);
        assertThat(result.getSpentToday()).isEqualTo(10.0);
        assertThat(result.getRemainingToday()).isEqualTo(expectedLimit - 10.0);
    }

    @Test
    void getTodayBudget_noneWhenNoMonthlyBudgetAndNoManual() {
        when(dailyBudgetRepository.findByUserAndDate(user, today)).thenReturn(Optional.empty());
        when(budgetRepository.findByUserAndMonthAndYear(user, today.getMonthValue(), today.getYear()))
                .thenReturn(Optional.empty());
        when(transactionRepository.sumExpenseByUserAndDate(user, today)).thenReturn(15.0);

        TodayBudgetResponse result = dailyBudgetService.getTodayBudget();

        assertThat(result.getSource()).isEqualTo(TodayBudgetResponse.Source.NONE);
        assertThat(result.getDailyLimit()).isNull();
        assertThat(result.getRemainingToday()).isNull();
        assertThat(result.getSpentToday()).isEqualTo(15.0);
    }
}
