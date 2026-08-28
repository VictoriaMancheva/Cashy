package com.cashy.service;

import com.cashy.dto.BudgetRequest;
import com.cashy.dto.BudgetResponse;
import com.cashy.entity.Budget;
import com.cashy.entity.BudgetCategory;
import com.cashy.entity.Category;
import com.cashy.entity.User;
import com.cashy.repository.BudgetCategoryRepository;
import com.cashy.repository.BudgetRepository;
import com.cashy.repository.CategoryRepository;
import com.cashy.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock BudgetRepository budgetRepository;
    @Mock BudgetCategoryRepository budgetCategoryRepository;
    @Mock CategoryRepository categoryRepository;
    @Mock TransactionRepository transactionRepository;
    @Mock UserService userService;

    @InjectMocks BudgetService budgetService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        when(userService.getCurrentUser()).thenReturn(user);
    }

    @Test
    void getBudgets_returnsListWithSpentAmounts() {
        Category cat = buildCategory(10L, "Groceries");
        Budget budget = buildBudget(1L, 6, 2025, 500.0);

        BudgetCategory bc = new BudgetCategory();
        bc.setId(1L);
        bc.setCategory(cat);
        bc.setLimitAmount(200.0);
        bc.setBudget(budget);

        when(budgetRepository.findByUserOrderByYearDescMonthDesc(user)).thenReturn(List.of(budget));
        when(budgetCategoryRepository.findByBudget(budget)).thenReturn(List.of(bc));
        when(transactionRepository.sumExpenseByUserAndCategoryAndDateRange(any(), any(), any(), any()))
                .thenReturn(75.0);

        List<BudgetResponse> result = budgetService.getBudgets();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategories()).hasSize(1);
        assertThat(result.get(0).getCategories().get(0).getSpentAmount()).isEqualTo(75.0);
        assertThat(result.get(0).getCategories().get(0).getLimitAmount()).isEqualTo(200.0);
    }

    @Test
    void createBudget_throwsWhenAlreadyExists() {
        when(budgetRepository.existsByUserAndMonthAndYear(user, 5, 2025)).thenReturn(true);

        BudgetRequest req = new BudgetRequest();
        req.setMonth(5);
        req.setYear(2025);
        req.setTotalAmount(1000.0);

        assertThatThrownBy(() -> budgetService.createBudget(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void createBudget_savesNewBudget() {
        Budget saved = buildBudget(1L, 5, 2025, 1000.0);

        when(budgetRepository.existsByUserAndMonthAndYear(user, 5, 2025)).thenReturn(false);
        when(budgetRepository.save(any())).thenReturn(saved);
        when(budgetCategoryRepository.findByBudget(saved)).thenReturn(List.of());

        BudgetRequest req = new BudgetRequest();
        req.setMonth(5);
        req.setYear(2025);
        req.setTotalAmount(1000.0);

        BudgetResponse result = budgetService.createBudget(req);

        assertThat(result.getTotalAmount()).isEqualTo(1000.0);
        verify(budgetRepository).save(any(Budget.class));
    }

    @Test
    void deleteBudget_throwsWhenNotFound() {
        when(budgetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> budgetService.deleteBudget(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("99");
    }

    @Test
    void deleteBudget_throwsWhenAccessDenied() {
        User other = new User();
        other.setId(2L);
        Budget budget = buildBudget(3L, 6, 2025, 500.0);
        budget.setUser(other);

        when(budgetRepository.findById(3L)).thenReturn(Optional.of(budget));

        assertThatThrownBy(() -> budgetService.deleteBudget(3L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Access denied");
    }

    private Budget buildBudget(Long id, int month, int year, double total) {
        Budget b = new Budget();
        b.setId(id);
        b.setMonth(month);
        b.setYear(year);
        b.setTotalAmount(total);
        b.setUser(user);
        return b;
    }

    private Category buildCategory(Long id, String name) {
        Category c = new Category();
        c.setId(id);
        c.setName(name);
        return c;
    }
}
