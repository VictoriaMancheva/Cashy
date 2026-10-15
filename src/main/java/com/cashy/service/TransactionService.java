package com.cashy.service;

import com.cashy.dto.TransactionFilterParams;
import com.cashy.dto.TransactionRequest;
import com.cashy.dto.TransactionResponse;
import com.cashy.specification.TransactionSpecification;
import com.cashy.entity.Category;
import com.cashy.entity.PaymentMethod;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import com.cashy.repository.BudgetCategoryRepository;
import com.cashy.repository.BudgetRepository;
import com.cashy.repository.CategoryRepository;
import com.cashy.repository.DailyBudgetRepository;
import com.cashy.repository.PaymentMethodRepository;
import com.cashy.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import org.springframework.data.domain.Sort;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final BudgetRepository budgetRepository;
    private final BudgetCategoryRepository budgetCategoryRepository;
    private final DailyBudgetRepository dailyBudgetRepository;
    private final NotificationService notificationService;
    private final UserService userService;

    private static final String TRANSACTION_NOT_FOUND = "Transaction not found: %d";
    private static final String CATEGORY_NOT_FOUND = "Category not found: %d";
    private static final String PAYMENT_METHOD_NOT_FOUND = "Payment method not found: %d";
    private static final String ACCESS_DENIED = "Access denied";
    private static final double BUDGET_WARN_THRESHOLD = 0.8;

    public List<TransactionResponse> getTransactions() {
        User user = userService.getCurrentUser();
        return transactionRepository.findByUserOrderByDateDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TransactionResponse> getFilteredTransactions(TransactionFilterParams params) {
        User user = userService.getCurrentUser();
        Sort sort = Sort.by(Sort.Direction.DESC, "date");
        return transactionRepository.findAll(TransactionSpecification.withFilters(user, params), sort).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TransactionResponse> getTransactionsByType(Transaction.TransactionType type) {
        User user = userService.getCurrentUser();
        return transactionRepository.findByUserAndTypeOrderByDateDesc(user, type).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TransactionResponse> getTransactionsByDateRange(LocalDate from, LocalDate to) {
        User user = userService.getCurrentUser();
        return transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, from, to).stream()
                .map(this::toResponse)
                .toList();
    }

    public TransactionResponse createTransaction(TransactionRequest request) {
        User user = userService.getCurrentUser();
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        transaction.setReceiptImage(request.getReceiptImage());
        transaction.setUser(user);
        transaction.setCategory(resolveCategory(request.getCategoryId(), user));
        transaction.setPaymentMethod(resolvePaymentMethod(request.getPaymentMethodId(), user));
        Transaction saved = transactionRepository.save(transaction);
        if (saved.getType() == Transaction.TransactionType.EXPENSE) {
            runBudgetChecks(user, saved, 0.0, 0.0, 0.0);
        }
        return toResponse(saved);
    }

    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        User user = userService.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(TRANSACTION_NOT_FOUND, id)));
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        double oldAmount = transaction.getAmount();
        LocalDate oldDate = transaction.getDate();
        Transaction.TransactionType oldType = transaction.getType();
        Long oldCategoryId = transaction.getCategory() != null ? transaction.getCategory().getId() : null;

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setReceiptImage(request.getReceiptImage());
        transaction.setCategory(resolveCategory(request.getCategoryId(), user));
        transaction.setPaymentMethod(resolvePaymentMethod(request.getPaymentMethodId(), user));
        Transaction saved = transactionRepository.save(transaction);

        if (saved.getType() == Transaction.TransactionType.EXPENSE) {
            LocalDate newDate = saved.getDate();
            boolean oldWasExpense = oldType == Transaction.TransactionType.EXPENSE;
            boolean sameDay = oldWasExpense && oldDate.equals(newDate);
            boolean samePeriod = oldWasExpense
                    && oldDate.getMonthValue() == newDate.getMonthValue()
                    && oldDate.getYear() == newDate.getYear();
            Long newCategoryId = saved.getCategory() != null ? saved.getCategory().getId() : null;
            boolean sameCategory = Objects.equals(oldCategoryId, newCategoryId);

            double originalForDaily = sameDay ? oldAmount : 0.0;
            double originalForMonthly = samePeriod ? oldAmount : 0.0;
            double originalForCategory = (samePeriod && sameCategory) ? oldAmount : 0.0;
            runBudgetChecks(user, saved, originalForDaily, originalForMonthly, originalForCategory);
        }
        return toResponse(saved);
    }

    public void deleteTransaction(Long id) {
        User user = userService.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(TRANSACTION_NOT_FOUND, id)));
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        transactionRepository.delete(transaction);
    }

    private void runBudgetChecks(User user, Transaction saved, double originalForDaily, double originalForMonthly, double originalForCategory) {
        checkDailyBudgetExceeded(user, saved.getDate(), saved.getAmount(), originalForDaily);
        checkBudgetCategoryExceeded(user, saved, originalForCategory);
        checkBudgetCategoryApproaching(user, saved, originalForCategory);
        checkOverallBudget(user, saved, originalForMonthly);
    }

    private void checkDailyBudgetExceeded(User user, LocalDate date, double newAmount, double originalAmount) {
        double effectiveLimit = resolveEffectiveDailyLimit(user, date);
        if (effectiveLimit <= 0) return;
        Double totalSpent = transactionRepository.sumExpenseByUserAndDate(user, date);
        double totalBefore = totalSpent - newAmount + originalAmount;
        if (totalBefore <= effectiveLimit && totalSpent > effectiveLimit) {
            notificationService.createNotification(user,
                    String.format("Daily budget exceeded on %s. Spent: %.2f / Limit: %.2f", date, totalSpent, effectiveLimit));
        }
    }

    private double resolveEffectiveDailyLimit(User user, LocalDate date) {
        var manual = dailyBudgetRepository.findByUserAndDate(user, date);
        if (manual.isPresent()) {
            return manual.get().getDailyLimit();
        }
        return budgetRepository.findByUserAndMonthAndYear(user, date.getMonthValue(), date.getYear())
                .map(budget -> {
                    LocalDate startOfMonth = date.withDayOfMonth(1);
                    LocalDate yesterday = date.minusDays(1);
                    double spentBeforeToday = yesterday.isBefore(startOfMonth) ? 0.0
                            : transactionRepository.sumByUserAndTypeAndDateRange(user, Transaction.TransactionType.EXPENSE, startOfMonth, yesterday);
                    int remainingDays = date.lengthOfMonth() - date.getDayOfMonth() + 1;
                    return (budget.getTotalAmount() - spentBeforeToday) / remainingDays;
                })
                .orElse(0.0);
    }

    private void checkBudgetCategoryExceeded(User user, Transaction transaction, double originalAmount) {
        if (transaction.getCategory() == null) return;
        LocalDate date = transaction.getDate();
        budgetRepository.findByUserAndMonthAndYear(user, date.getMonthValue(), date.getYear()).ifPresent(budget -> {
            LocalDate startDate = LocalDate.of(budget.getYear(), budget.getMonth(), 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
            budgetCategoryRepository.findByBudget(budget).stream()
                    .filter(bc -> bc.getCategory().getId().equals(transaction.getCategory().getId()))
                    .findFirst()
                    .ifPresent(bc -> {
                        Double spent = transactionRepository.sumExpenseByUserAndCategoryAndDateRange(
                                user, bc.getCategory(), startDate, endDate);
                        double spentBefore = spent - transaction.getAmount() + originalAmount;
                        if (spentBefore <= bc.getLimitAmount() && spent > bc.getLimitAmount()) {
                            notificationService.createNotification(user,
                                    String.format("Budget limit exceeded for category \"%s\". Spent: %.2f / Limit: %.2f",
                                            bc.getCategory().getName(), spent, bc.getLimitAmount()));
                        }
                    });
        });
    }

    private void checkBudgetCategoryApproaching(User user, Transaction transaction, double originalAmount) {
        if (transaction.getCategory() == null) return;
        LocalDate date = transaction.getDate();
        budgetRepository.findByUserAndMonthAndYear(user, date.getMonthValue(), date.getYear()).ifPresent(budget -> {
            LocalDate startDate = LocalDate.of(budget.getYear(), budget.getMonth(), 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
            budgetCategoryRepository.findByBudget(budget).stream()
                    .filter(bc -> bc.getCategory().getId().equals(transaction.getCategory().getId()))
                    .findFirst()
                    .ifPresent(bc -> {
                        Double spent = transactionRepository.sumExpenseByUserAndCategoryAndDateRange(
                                user, bc.getCategory(), startDate, endDate);
                        double spentBefore = spent - transaction.getAmount() + originalAmount;
                        double warnAt = bc.getLimitAmount() * BUDGET_WARN_THRESHOLD;
                        if (spentBefore < warnAt && spent >= warnAt && spent < bc.getLimitAmount()) {
                            notificationService.createNotification(user,
                                    String.format("Heads up: %.0f%% of your \"%s\" budget used. Spent: %.2f / Limit: %.2f",
                                            BUDGET_WARN_THRESHOLD * 100, bc.getCategory().getName(), spent, bc.getLimitAmount()));
                        }
                    });
        });
    }

    private void checkOverallBudget(User user, Transaction transaction, double originalAmount) {
        LocalDate date = transaction.getDate();
        budgetRepository.findByUserAndMonthAndYear(user, date.getMonthValue(), date.getYear()).ifPresent(budget -> {
            LocalDate startDate = LocalDate.of(budget.getYear(), budget.getMonth(), 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
            Double totalSpent = transactionRepository.sumByUserAndTypeAndDateRange(
                    user, Transaction.TransactionType.EXPENSE, startDate, endDate);
            double spentBefore = totalSpent - transaction.getAmount() + originalAmount;
            double warnAt = budget.getTotalAmount() * BUDGET_WARN_THRESHOLD;
            if (spentBefore < warnAt && totalSpent >= warnAt && totalSpent < budget.getTotalAmount()) {
                notificationService.createNotification(user,
                        String.format("Heads up: you've used %.0f%% of your monthly budget. Spent: %.2f / Total: %.2f",
                                BUDGET_WARN_THRESHOLD * 100, totalSpent, budget.getTotalAmount()));
            }
            if (spentBefore < budget.getTotalAmount() && totalSpent >= budget.getTotalAmount()) {
                notificationService.createNotification(user,
                        String.format("Monthly budget exceeded! Spent: %.2f / Total: %.2f",
                                totalSpent, budget.getTotalAmount()));
            }
        });
    }

    private Category resolveCategory(Long categoryId, User user) {
        if (categoryId == null) return null;
        return categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new IllegalArgumentException(String.format(CATEGORY_NOT_FOUND, categoryId)));
    }

    private PaymentMethod resolvePaymentMethod(Long paymentMethodId, User user) {
        if (paymentMethodId == null) return null;
        return paymentMethodRepository.findByIdAndUser(paymentMethodId, user)
                .orElseThrow(() -> new IllegalArgumentException(String.format(PAYMENT_METHOD_NOT_FOUND, paymentMethodId)));
    }

    private TransactionResponse toResponse(Transaction t) {
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
                t.getPaymentMethod() != null ? t.getPaymentMethod().getName() : null
        );
    }
}
