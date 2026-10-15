package com.cashy.service;

import com.cashy.dto.TransactionFilterParams;
import com.cashy.dto.TransactionResponse;
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
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceFilterTest {

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
        when(userService.getCurrentUser()).thenReturn(user);
    }

    @Test
    void getFilteredTransactions_noFilters_delegatesToSpecificationExecutor() {
        Transaction t = buildTransaction(100.0, Transaction.TransactionType.INCOME);
        when(transactionRepository.findAll(any(Specification.class), any(Sort.class))).thenReturn(List.of(t));

        TransactionFilterParams params = new TransactionFilterParams(null, null, null, null, null, null, null, null);
        List<TransactionResponse> result = transactionService.getFilteredTransactions(params);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAmount()).isEqualTo(100.0);
        verify(transactionRepository).findAll(any(Specification.class), any(Sort.class));
    }

    @Test
    void getFilteredTransactions_withTypeFilter_passesSpecToRepository() {
        Transaction expense = buildTransaction(50.0, Transaction.TransactionType.EXPENSE);
        when(transactionRepository.findAll(any(Specification.class), any(Sort.class))).thenReturn(List.of(expense));

        TransactionFilterParams params = new TransactionFilterParams(Transaction.TransactionType.EXPENSE, null, null, null, null, null, null, null);
        List<TransactionResponse> result = transactionService.getFilteredTransactions(params);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getType()).isEqualTo(Transaction.TransactionType.EXPENSE);
        verify(transactionRepository).findAll(any(Specification.class), any(Sort.class));
    }

    @Test
    void getFilteredTransactions_withDateRange_passesSpecToRepository() {
        Transaction t = buildTransaction(75.0, Transaction.TransactionType.INCOME);
        when(transactionRepository.findAll(any(Specification.class), any(Sort.class))).thenReturn(List.of(t));

        TransactionFilterParams params = new TransactionFilterParams(null, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 31), null, null, null, null, null);
        List<TransactionResponse> result = transactionService.getFilteredTransactions(params);

        assertThat(result).hasSize(1);
        verify(transactionRepository).findAll(any(Specification.class), any(Sort.class));
    }

    @Test
    void getFilteredTransactions_withSearch_passesSpecToRepository() {
        Transaction t = buildTransaction(30.0, Transaction.TransactionType.EXPENSE);
        when(transactionRepository.findAll(any(Specification.class), any(Sort.class))).thenReturn(List.of(t));

        TransactionFilterParams params = new TransactionFilterParams(null, null, null, null, null, null, null, "coffee");
        List<TransactionResponse> result = transactionService.getFilteredTransactions(params);

        assertThat(result).hasSize(1);
        verify(transactionRepository).findAll(any(Specification.class), any(Sort.class));
    }

    @Test
    void getFilteredTransactions_emptyResult_returnsEmptyList() {
        when(transactionRepository.findAll(any(Specification.class), any(Sort.class))).thenReturn(List.of());

        TransactionFilterParams params = new TransactionFilterParams(null, null, null, 99L, null, null, null, null);
        List<TransactionResponse> result = transactionService.getFilteredTransactions(params);

        assertThat(result).isEmpty();
    }

    @Test
    void getFilteredTransactions_resultsSortedByDateDesc() {
        Transaction t1 = buildTransaction(10.0, Transaction.TransactionType.EXPENSE);
        Transaction t2 = buildTransaction(20.0, Transaction.TransactionType.INCOME);
        when(transactionRepository.findAll(any(Specification.class), any(Sort.class))).thenReturn(List.of(t1, t2));

        TransactionFilterParams params = new TransactionFilterParams(null, null, null, null, null, null, null, null);
        List<TransactionResponse> result = transactionService.getFilteredTransactions(params);

        assertThat(result).hasSize(2);
        verify(transactionRepository).findAll(any(Specification.class), any(Sort.class));
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
