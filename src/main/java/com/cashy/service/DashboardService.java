package com.cashy.service;

import com.cashy.dto.DashboardSummaryResponse;
import com.cashy.dto.TransactionResponse;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import com.cashy.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final int RECENT_TRANSACTION_COUNT = 5;

    private final TransactionRepository transactionRepository;
    private final UserService userService;

    public DashboardSummaryResponse getSummary() {
        User user = userService.getCurrentUser();
        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());

        Double totalIncome = transactionRepository.sumByUserAndType(user, Transaction.TransactionType.INCOME);
        Double totalExpenses = transactionRepository.sumByUserAndType(user, Transaction.TransactionType.EXPENSE);
        Double currentMonthIncome = transactionRepository.sumByUserAndTypeAndDateRange(user, Transaction.TransactionType.INCOME, monthStart, monthEnd);
        Double currentMonthExpenses = transactionRepository.sumByUserAndTypeAndDateRange(user, Transaction.TransactionType.EXPENSE, monthStart, monthEnd);

        List<TransactionResponse> recent = transactionRepository
                .findByUserOrderByDateDesc(user, PageRequest.of(0, RECENT_TRANSACTION_COUNT))
                .stream()
                .map(this::toResponse)
                .toList();

        return new DashboardSummaryResponse(
                totalIncome,
                totalExpenses,
                totalIncome - totalExpenses,
                currentMonthIncome,
                currentMonthExpenses,
                recent);
    }

    private TransactionResponse toResponse(com.cashy.entity.Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getAmount(),
                t.getType(),
                t.getDescription(),
                t.getDate(),
                t.getReceiptImage(),
                t.getCategory() != null ? t.getCategory().getId() : null,
                t.getCategory() != null ? t.getCategory().getName() : null,
                t.getPaymentMethod() != null ? t.getPaymentMethod().getId() : null,
                t.getPaymentMethod() != null ? t.getPaymentMethod().getName() : null);
    }
}
