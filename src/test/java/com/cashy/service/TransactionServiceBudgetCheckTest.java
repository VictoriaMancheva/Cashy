package com.cashy.service;

import com.cashy.dto.TransactionRequest;
import com.cashy.entity.Budget;
import com.cashy.entity.Category;
import com.cashy.entity.DailyBudget;
import com.cashy.entity.PaymentMethod;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import com.cashy.repository.BudgetCategoryRepository;
import com.cashy.repository.BudgetRepository;
import com.cashy.repository.CategoryRepository;
import com.cashy.repository.DailyBudgetRepository;
import com.cashy.repository.PaymentMethodRepository;
import com.cashy.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceBudgetCheckTest {

    @Mock TransactionRepository transactionRepository;
    @Mock CategoryRepository categoryRepository;
    @Mock PaymentMethodRepository paymentMethodRepository;
    @Mock BudgetRepository budgetRepository;
    @Mock BudgetCategoryRepository budgetCategoryRepository;
    @Mock DailyBudgetRepository dailyBudgetRepository;
    @Mock NotificationService notificationService;
    @Mock UserService userService;

    @InjectMocks TransactionService transactionService;

    private static final LocalDate TODAY = LocalDate.now();
    private User user;
    private Budget budget;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        when(userService.getCurrentUser()).thenReturn(user);

        budget = new Budget();
        budget.setId(1L);
        budget.setMonth(TODAY.getMonthValue());
        budget.setYear(TODAY.getYear());
        budget.setTotalAmount(100.0);
        budget.setUser(user);
    }

    // ── resolveCategory ownership ───────────────────────────────────────

    @Test
    void createTransaction_throwsWhenCategoryBelongsToOtherUser() {
        TransactionRequest req = buildExpenseRequest(50.0, 7L, null);
        when(categoryRepository.findByIdAndUser(7L, user)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.createTransaction(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("7");
    }

    @Test
    void createTransaction_throwsWhenPaymentMethodBelongsToOtherUser() {
        TransactionRequest req = buildExpenseRequest(50.0, null, 8L);
        when(paymentMethodRepository.findByIdAndUser(8L, user)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.createTransaction(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("8");
    }

    // ── 100% budget exceeded notification ──────────────────────────────

    @Test
    void createTransaction_notifiesWhenMonthlyBudgetExceeded() {
        TransactionRequest req = buildExpenseRequest(30.0, null, null);
        Transaction saved = buildTransaction(30.0);

        when(transactionRepository.save(any())).thenReturn(saved);
        when(dailyBudgetRepository.findByUserAndDate(any(), any())).thenReturn(Optional.empty());
        when(budgetRepository.findByUserAndMonthAndYear(eq(user), any(), any())).thenReturn(Optional.of(budget));
        when(budgetCategoryRepository.findByBudget(budget)).thenReturn(List.of());
        // spentBefore = 95, totalSpent = 110 → crossed 100%
        when(transactionRepository.sumByUserAndTypeAndDateRange(eq(user), eq(Transaction.TransactionType.EXPENSE), any(), any()))
                .thenReturn(110.0);

        transactionService.createTransaction(req);

        verify(notificationService).createNotification(eq(user), anyString());
    }

    @Test
    void createTransaction_noNotification_whenAlreadyExceededBeforeAdd() {
        TransactionRequest req = buildExpenseRequest(10.0, null, null);
        Transaction saved = buildTransaction(10.0);

        when(transactionRepository.save(any())).thenReturn(saved);
        when(dailyBudgetRepository.findByUserAndDate(any(), any())).thenReturn(Optional.empty());
        when(budgetRepository.findByUserAndMonthAndYear(eq(user), any(), any())).thenReturn(Optional.of(budget));
        when(budgetCategoryRepository.findByBudget(budget)).thenReturn(List.of());
        // spentBefore = 110, totalSpent = 120 → was already exceeded → no duplicate
        when(transactionRepository.sumByUserAndTypeAndDateRange(eq(user), eq(Transaction.TransactionType.EXPENSE), any(), any()))
                .thenReturn(120.0);

        transactionService.createTransaction(req);

        verify(notificationService, never()).createNotification(any(), anyString());
    }

    // ── updateTransaction runs checks ─────────────────────────────────

    @Test
    void updateTransaction_triggersNotification_whenDailyLimitCrossed() {
        LocalDate date = TODAY;
        Transaction existing = buildTransaction(20.0);
        existing.setId(5L);
        existing.setDate(date);

        TransactionRequest req = buildExpenseRequest(60.0, null, null);
        req.setDate(date);

        Transaction saved = buildTransaction(60.0);
        saved.setId(5L);
        saved.setDate(date);

        DailyBudget db = new DailyBudget();
        db.setDailyLimit(50.0);
        db.setDate(date);
        db.setUser(user);

        when(transactionRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(transactionRepository.save(any())).thenReturn(saved);
        when(dailyBudgetRepository.findByUserAndDate(user, date)).thenReturn(Optional.of(db));
        // totalSpent after save = 70 (crosses 50 limit)
        when(transactionRepository.sumExpenseByUserAndDate(user, date)).thenReturn(70.0);
        when(budgetRepository.findByUserAndMonthAndYear(eq(user), any(), any())).thenReturn(Optional.empty());

        transactionService.updateTransaction(5L, req);

        verify(notificationService).createNotification(eq(user), anyString());
    }

    @Test
    void updateTransaction_noDuplicateNotification_whenAlreadyExceeded() {
        LocalDate date = TODAY;
        // Old amount was 80, already over daily limit of 50
        Transaction existing = buildTransaction(80.0);
        existing.setId(6L);
        existing.setDate(date);

        // Update: just change description (amount stays same conceptually, new req has same amount)
        TransactionRequest req = buildExpenseRequest(80.0, null, null);
        req.setDate(date);

        Transaction saved = buildTransaction(80.0);
        saved.setId(6L);
        saved.setDate(date);

        DailyBudget db = new DailyBudget();
        db.setDailyLimit(50.0);
        db.setDate(date);
        db.setUser(user);

        when(transactionRepository.findById(6L)).thenReturn(Optional.of(existing));
        when(transactionRepository.save(any())).thenReturn(saved);
        when(dailyBudgetRepository.findByUserAndDate(user, date)).thenReturn(Optional.of(db));
        // totalSpent = 80, totalBefore = 80 - 80 + 80 = 80 > limit → was already over, no crossing
        when(transactionRepository.sumExpenseByUserAndDate(user, date)).thenReturn(80.0);
        when(budgetRepository.findByUserAndMonthAndYear(eq(user), any(), any())).thenReturn(Optional.empty());

        transactionService.updateTransaction(6L, req);

        verify(notificationService, never()).createNotification(any(), anyString());
    }

    // ── resolveCategory/PaymentMethod: happy path ─────────────────────

    @Test
    void createTransaction_succeedsWithOwnedCategory() {
        Category cat = new Category();
        cat.setId(3L);
        cat.setUser(user);

        TransactionRequest req = buildExpenseRequest(20.0, 3L, null);
        Transaction saved = buildTransaction(20.0);
        saved.setCategory(cat);

        when(categoryRepository.findByIdAndUser(3L, user)).thenReturn(Optional.of(cat));
        when(transactionRepository.save(any())).thenReturn(saved);
        when(dailyBudgetRepository.findByUserAndDate(any(), any())).thenReturn(Optional.empty());
        when(budgetRepository.findByUserAndMonthAndYear(any(), any(), any())).thenReturn(Optional.empty());

        var result = transactionService.createTransaction(req);

        verify(transactionRepository).save(any(Transaction.class));
        assert result != null;
    }

    private TransactionRequest buildExpenseRequest(double amount, Long categoryId, Long paymentMethodId) {
        TransactionRequest req = new TransactionRequest();
        req.setAmount(amount);
        req.setType(Transaction.TransactionType.EXPENSE);
        req.setDate(TODAY);
        req.setCategoryId(categoryId);
        req.setPaymentMethodId(paymentMethodId);
        return req;
    }

    private Transaction buildTransaction(double amount) {
        Transaction t = new Transaction();
        t.setId(1L);
        t.setAmount(amount);
        t.setType(Transaction.TransactionType.EXPENSE);
        t.setDate(TODAY);
        t.setUser(user);
        return t;
    }
}
