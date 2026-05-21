package com.cashy.service;

import com.cashy.dto.DailyBudgetRequest;
import com.cashy.dto.DailyBudgetResponse;
import com.cashy.entity.DailyBudget;
import com.cashy.entity.User;
import com.cashy.repository.DailyBudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyBudgetService {

    private final DailyBudgetRepository dailyBudgetRepository;
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
