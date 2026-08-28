package com.cashy.service;

import com.cashy.dto.CategoryBreakdownResponse;
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
