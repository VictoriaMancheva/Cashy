package com.cashy.service;

import com.cashy.dto.CategoryBreakdownResponse;
import com.cashy.dto.ForecastResponse;
import com.cashy.dto.MonthlyBreakdownResponse;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import com.cashy.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private static final int MONTHS_HISTORY = 12;

    private final TransactionRepository transactionRepository;
    private final UserService userService;

    public List<MonthlyBreakdownResponse> getMonthlyBreakdown() {
        User user = userService.getCurrentUser();
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusMonths(MONTHS_HISTORY - 1).withDayOfMonth(1);

        List<Transaction> transactions = transactionRepository
                .findByUserAndDateBetweenOrderByDateDesc(user, startDate, today);

        Map<String, double[]> byMonth = transactions.stream().collect(
                Collectors.groupingBy(
                        t -> t.getDate().getYear() + "-" + t.getDate().getMonthValue(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    double income = list.stream()
                                            .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                                            .mapToDouble(Transaction::getAmount).sum();
                                    double expenses = list.stream()
                                            .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                                            .mapToDouble(Transaction::getAmount).sum();
                                    return new double[]{income, expenses};
                                })));

        List<MonthlyBreakdownResponse> result = new ArrayList<>();
        for (int i = MONTHS_HISTORY - 1; i >= 0; i--) {
            LocalDate month = today.minusMonths(i).withDayOfMonth(1);
            String key = month.getYear() + "-" + month.getMonthValue();
            double[] sums = byMonth.getOrDefault(key, new double[]{0.0, 0.0});
            result.add(new MonthlyBreakdownResponse(month.getYear(), month.getMonthValue(), sums[0], sums[1]));
        }
        return result;
    }

    public ForecastResponse getForecast() {
        User user = userService.getCurrentUser();
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusMonths(MONTHS_HISTORY - 1).withDayOfMonth(1);

        List<Transaction> transactions = transactionRepository
                .findByUserAndDateBetweenOrderByDateDesc(user, startDate, today);

        double[] incomeByIndex = new double[MONTHS_HISTORY];
        double[] expensesByIndex = new double[MONTHS_HISTORY];

        for (int i = 0; i < MONTHS_HISTORY; i++) {
            LocalDate month = today.minusMonths(MONTHS_HISTORY - 1 - i).withDayOfMonth(1);
            int y = month.getYear();
            int m = month.getMonthValue();
            for (Transaction t : transactions) {
                if (t.getDate().getYear() == y && t.getDate().getMonthValue() == m) {
                    if (t.getType() == Transaction.TransactionType.INCOME) {
                        incomeByIndex[i] += t.getAmount();
                    } else {
                        expensesByIndex[i] += t.getAmount();
                    }
                }
            }
        }

        double forecastIncome = linearRegressionForecast(incomeByIndex);
        double forecastExpenses = linearRegressionForecast(expensesByIndex);

        LocalDate nextMonth = today.plusMonths(1).withDayOfMonth(1);
        return new ForecastResponse(
                nextMonth.getMonthValue(),
                nextMonth.getYear(),
                Math.round(forecastIncome * 100.0) / 100.0,
                Math.round(forecastExpenses * 100.0) / 100.0,
                Math.round((forecastIncome - forecastExpenses) * 100.0) / 100.0
        );
    }

    private double linearRegressionForecast(double[] values) {
        int n = values.length;
        double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        for (int i = 0; i < n; i++) {
            sumX += i;
            sumY += values[i];
            sumXY += (double) i * values[i];
            sumX2 += (double) i * i;
        }
        double denominator = n * sumX2 - sumX * sumX;
        if (denominator == 0) {
            return Math.max(0, sumY / n);
        }
        double slope = (n * sumXY - sumX * sumY) / denominator;
        double intercept = (sumY - slope * sumX) / n;
        return Math.max(0, intercept + slope * n);
    }

    public List<CategoryBreakdownResponse> getCategoryBreakdown(int month, int year) {
        User user = userService.getCurrentUser();
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Transaction> transactions = transactionRepository
                .findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);

        return transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        t -> t.getCategory() != null ? t.getCategory().getId() : -1L,
                        Collectors.summingDouble(Transaction::getAmount)))
                .entrySet().stream()
                .map(e -> {
                    Transaction sample = transactions.stream()
                            .filter(t -> {
                                Long catId = t.getCategory() != null ? t.getCategory().getId() : -1L;
                                return catId.equals(e.getKey());
                            })
                            .findFirst().orElseThrow();
                    String name = sample.getCategory() != null ? sample.getCategory().getName() : "Uncategorized";
                    return new CategoryBreakdownResponse(e.getKey(), name, e.getValue());
                })
                .sorted((a, b) -> Double.compare(b.getAmount(), a.getAmount()))
                .collect(Collectors.toList());
    }
}
