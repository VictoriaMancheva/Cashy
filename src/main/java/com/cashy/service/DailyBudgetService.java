package com.cashy.service;

import com.cashy.dto.DailyBudgetRequest;
import com.cashy.dto.DailyBudgetResponse;
import com.cashy.dto.TodayBudgetResponse;
import com.cashy.entity.Budget;
import com.cashy.entity.DailyBudget;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import com.cashy.repository.BudgetRepository;
import com.cashy.repository.DailyBudgetRepository;
import com.cashy.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DailyBudgetService {

    private final DailyBudgetRepository dailyBudgetRepository;
    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;

    private static final String DAILY_BUDGET_NOT_FOUND = "Daily budget not found: %d";
    private static final String ACCESS_DENIED = "Access denied";

    public List<DailyBudgetResponse> getDailyBudgets() {
        User user = userService.getCurrentUser();
        return dailyBudgetRepository.findByUserOrderByDateDesc(user).stream()
                .map(d -> new DailyBudgetResponse(d.getId(), d.getDailyLimit(), d.getDate()))
                .toList();
    }

    // Upsert: creates a new entry or updates the existing one for the given date
    public DailyBudgetResponse setDailyBudget(DailyBudgetRequest request) {
        User user = userService.getCurrentUser();
        LocalDate date = request.getDate() != null ? request.getDate() : LocalDate.now();
        DailyBudget dailyBudget = dailyBudgetRepository.findByUserAndDate(user, date)
                .orElse(new DailyBudget());
        dailyBudget.setDailyLimit(request.getDailyLimit());
        dailyBudget.setDate(date);
        dailyBudget.setUser(user);
        DailyBudget saved = dailyBudgetRepository.save(dailyBudget);
        return new DailyBudgetResponse(saved.getId(), saved.getDailyLimit(), saved.getDate());
    }

    public TodayBudgetResponse getTodayBudget() {
        User user = userService.getCurrentUser();
        LocalDate today = LocalDate.now();
        Double spentToday = transactionRepository.sumExpenseByUserAndDate(user, today);

        Optional<DailyBudget> manual = dailyBudgetRepository.findByUserAndDate(user, today);
        if (manual.isPresent()) {
            double limit = manual.get().getDailyLimit();
            return new TodayBudgetResponse(today, limit, spentToday, limit - spentToday, TodayBudgetResponse.Source.MANUAL);
        }

        Optional<Budget> budget = budgetRepository.findByUserAndMonthAndYear(user, today.getMonthValue(), today.getYear());
        if (budget.isEmpty()) {
            return new TodayBudgetResponse(today, null, spentToday, null, TodayBudgetResponse.Source.NONE);
        }

        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate yesterday = today.minusDays(1);
        double spentBeforeToday = yesterday.isBefore(startOfMonth) ? 0.0
                : transactionRepository.sumByUserAndTypeAndDateRange(user, Transaction.TransactionType.EXPENSE, startOfMonth, yesterday);
        int remainingDays = today.lengthOfMonth() - today.getDayOfMonth() + 1;
        double calculatedLimit = (budget.get().getTotalAmount() - spentBeforeToday) / remainingDays;
        return new TodayBudgetResponse(today, calculatedLimit, spentToday, calculatedLimit - spentToday, TodayBudgetResponse.Source.CALCULATED);
    }

    public void deleteDailyBudget(Long id) {
        User user = userService.getCurrentUser();
        DailyBudget dailyBudget = dailyBudgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(DAILY_BUDGET_NOT_FOUND, id)));
        if (!dailyBudget.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        dailyBudgetRepository.delete(dailyBudget);
    }
}
