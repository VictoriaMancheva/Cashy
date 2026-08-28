package com.cashy.service;

import com.cashy.dto.TransactionRequest;
import com.cashy.dto.TransactionResponse;
import com.cashy.entity.Budget;
import com.cashy.entity.BudgetCategory;
import com.cashy.entity.Category;
import com.cashy.entity.DailyBudget;
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
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock TransactionRepository transactionRepository;
    @Mock CategoryRepository categoryRepository;
    @Mock PaymentMethodRepository paymentMethodRepository;
    @Mock BudgetRepository budgetRepository;
    @Mock BudgetCategoryRepository budgetCategoryRepository;
    @Mock DailyBudgetRepository dailyBudgetRepository;
    @Mock NotificationService notificationService;
    @Mock UserService userService;

    @InjectMocks TransactionService transactionService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@cashy.com");
        when(userService.getCurrentUser()).thenReturn(user);
    }

    @Test
    void getTransactions_returnsAllForCurrentUser() {
        Transaction t = buildTransaction(10.0, Transaction.TransactionType.INCOME);
        when(transactionRepository.findByUserOrderByDateDesc(user)).thenReturn(List.of(t));

        List<TransactionResponse> result = transactionService.getTransactions();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAmount()).isEqualTo(10.0);
    }

    @Test
    void createTransaction_savesAndReturnsResponse() {
        TransactionRequest req = new TransactionRequest();
        req.setAmount(50.0);
        req.setType(Transaction.TransactionType.INCOME);
        req.setDate(LocalDate.now());

        Transaction saved = buildTransaction(50.0, Transaction.TransactionType.INCOME);
        when(transactionRepository.save(any())).thenReturn(saved);
        when(dailyBudgetRepository.findByUserAndDate(any(), any())).thenReturn(Optional.empty());

        TransactionResponse result = transactionService.createTransaction(req);

        assertThat(result.getAmount()).isEqualTo(50.0);
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void createTransaction_income_doesNotCheckBudgets() {
        TransactionRequest req = new TransactionRequest();
        req.setAmount(100.0);
        req.setType(Transaction.TransactionType.INCOME);
        req.setDate(LocalDate.now());

        Transaction saved = buildTransaction(100.0, Transaction.TransactionType.INCOME);
        when(transactionRepository.save(any())).thenReturn(saved);

        transactionService.createTransaction(req);

        verify(dailyBudgetRepository, never()).findByUserAndDate(any(), any());
        verify(budgetRepository, never()).findByUserAndMonthAndYear(any(), any(), any());
        verify(notificationService, never()).createNotification(any(), anyString());
    }

    @Test
    void createTransaction_expense_sendsNotification_whenDailyLimitExceeded() {
        LocalDate today = LocalDate.now();
        TransactionRequest req = new TransactionRequest();
        req.setAmount(30.0);
        req.setType(Transaction.TransactionType.EXPENSE);
        req.setDate(today);

        Transaction saved = buildTransaction(30.0, Transaction.TransactionType.EXPENSE);
        saved.setDate(today);

        DailyBudget db = new DailyBudget();
        db.setDailyLimit(20.0);
        db.setDate(today);
        db.setUser(user);

        when(transactionRepository.save(any())).thenReturn(saved);
        when(dailyBudgetRepository.findByUserAndDate(user, today)).thenReturn(Optional.of(db));
        when(transactionRepository.sumExpenseByUserAndDate(user, today)).thenReturn(30.0);
        when(budgetRepository.findByUserAndMonthAndYear(any(), any(), any())).thenReturn(Optional.empty());

        transactionService.createTransaction(req);

        verify(notificationService).createNotification(eq(user), anyString());
    }

    @Test
    void createTransaction_expense_noNotification_whenUnderDailyLimit() {
        LocalDate today = LocalDate.now();
        TransactionRequest req = new TransactionRequest();
        req.setAmount(10.0);
        req.setType(Transaction.TransactionType.EXPENSE);
        req.setDate(today);

        Transaction saved = buildTransaction(10.0, Transaction.TransactionType.EXPENSE);
        saved.setDate(today);

        DailyBudget db = new DailyBudget();
        db.setDailyLimit(50.0);
        db.setDate(today);
        db.setUser(user);

        when(transactionRepository.save(any())).thenReturn(saved);
        when(dailyBudgetRepository.findByUserAndDate(user, today)).thenReturn(Optional.of(db));
        when(transactionRepository.sumExpenseByUserAndDate(user, today)).thenReturn(10.0);
        when(budgetRepository.findByUserAndMonthAndYear(any(), any(), any())).thenReturn(Optional.empty());

        transactionService.createTransaction(req);

        verify(notificationService, never()).createNotification(any(), anyString());
    }

    @Test
    void createTransaction_expense_sendsNotification_whenCategoryBudgetExceeded() {
        LocalDate today = LocalDate.now();
        Category category = new Category();
        category.setId(5L);
        category.setName("Food");

        TransactionRequest req = new TransactionRequest();
        req.setAmount(60.0);
        req.setType(Transaction.TransactionType.EXPENSE);
        req.setDate(today);
        req.setCategoryId(5L);

        Transaction saved = buildTransaction(60.0, Transaction.TransactionType.EXPENSE);
        saved.setDate(today);
        saved.setCategory(category);

        Budget budget = new Budget();
        budget.setId(1L);
        budget.setMonth(today.getMonthValue());
        budget.setYear(today.getYear());
        budget.setUser(user);

        BudgetCategory bc = new BudgetCategory();
        bc.setLimitAmount(50.0);
        bc.setCategory(category);
        bc.setBudget(budget);

        when(categoryRepository.findById(5L)).thenReturn(Optional.of(category));
        when(transactionRepository.save(any())).thenReturn(saved);
        when(dailyBudgetRepository.findByUserAndDate(any(), any())).thenReturn(Optional.empty());
        when(budgetRepository.findByUserAndMonthAndYear(eq(user), eq(today.getMonthValue()), eq(today.getYear())))
                .thenReturn(Optional.of(budget));
        when(budgetCategoryRepository.findByBudget(budget)).thenReturn(List.of(bc));
        when(transactionRepository.sumExpenseByUserAndCategoryAndDateRange(any(), eq(category), any(), any()))
                .thenReturn(60.0);

        transactionService.createTransaction(req);

        verify(notificationService).createNotification(eq(user), anyString());
    }

    @Test
    void deleteTransaction_throwsWhenNotFound() {
        when(transactionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.deleteTransaction(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("99");
    }

    @Test
    void deleteTransaction_throwsWhenAccessDenied() {
        User other = new User();
        other.setId(2L);

        Transaction t = buildTransaction(10.0, Transaction.TransactionType.EXPENSE);
        t.setId(7L);
        t.setUser(other);

        when(transactionRepository.findById(7L)).thenReturn(Optional.of(t));

        assertThatThrownBy(() -> transactionService.deleteTransaction(7L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Access denied");
    }

    @Test
    void deleteTransaction_deletesWhenOwner() {
        Transaction t = buildTransaction(10.0, Transaction.TransactionType.EXPENSE);
        t.setId(3L);
        t.setUser(user);

        when(transactionRepository.findById(3L)).thenReturn(Optional.of(t));

        transactionService.deleteTransaction(3L);

        verify(transactionRepository).delete(t);
    }

    @Test
    void getTransactionsByType_filtersCorrectly() {
        Transaction income = buildTransaction(100.0, Transaction.TransactionType.INCOME);
        when(transactionRepository.findByUserAndTypeOrderByDateDesc(user, Transaction.TransactionType.INCOME))
                .thenReturn(List.of(income));

        List<TransactionResponse> result = transactionService.getTransactionsByType(Transaction.TransactionType.INCOME);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getType()).isEqualTo(Transaction.TransactionType.INCOME);
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
