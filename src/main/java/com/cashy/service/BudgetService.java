package com.cashy.service;

import com.cashy.dto.BudgetCategoryRequest;
import com.cashy.dto.BudgetCategoryResponse;
import com.cashy.dto.BudgetRequest;
import com.cashy.dto.BudgetResponse;
import com.cashy.entity.Budget;
import com.cashy.entity.BudgetCategory;
import com.cashy.entity.Category;
import com.cashy.entity.User;
import com.cashy.repository.BudgetCategoryRepository;
import com.cashy.repository.BudgetRepository;
import com.cashy.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final BudgetCategoryRepository budgetCategoryRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    private static final String BUDGET_NOT_FOUND = "Budget not found: %d";
    private static final String BUDGET_ALREADY_EXISTS = "Budget already exists for %d/%d";
    private static final String CATEGORY_NOT_FOUND = "Category not found: %d";
    private static final String ACCESS_DENIED = "Access denied";

    public List<BudgetResponse> getBudgets() {
        User user = userService.getCurrentUser();
        return budgetRepository.findByUserOrderByYearDescMonthDesc(user).stream()
                .map(b -> toResponse(b, budgetCategoryRepository.findByBudget(b)))
                .toList();
    }

    public BudgetResponse getBudget(Long id) {
        User user = userService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(BUDGET_NOT_FOUND, id)));
        if (!budget.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        return toResponse(budget, budgetCategoryRepository.findByBudget(budget));
    }

    @Transactional
    public BudgetResponse createBudget(BudgetRequest request) {
        User user = userService.getCurrentUser();
        if (budgetRepository.existsByUserAndMonthAndYear(user, request.getMonth(), request.getYear())) {
            throw new IllegalArgumentException(
                    String.format(BUDGET_ALREADY_EXISTS, request.getMonth(), request.getYear()));
        }
        Budget budget = new Budget();
        budget.setTotalAmount(request.getTotalAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        budget.setUser(user);
        Budget saved = budgetRepository.save(budget);
        List<BudgetCategory> categories = saveBudgetCategories(request.getCategories(), saved);
        return toResponse(saved, categories);
    }

    @Transactional
    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        User user = userService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(BUDGET_NOT_FOUND, id)));
        if (!budget.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        budget.setTotalAmount(request.getTotalAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        Budget saved = budgetRepository.save(budget);
        budgetCategoryRepository.deleteByBudget(saved);
        List<BudgetCategory> categories = saveBudgetCategories(request.getCategories(), saved);
        return toResponse(saved, categories);
    }

    public void deleteBudget(Long id) {
        User user = userService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(BUDGET_NOT_FOUND, id)));
        if (!budget.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        budgetRepository.delete(budget);
    }

    private List<BudgetCategory> saveBudgetCategories(List<BudgetCategoryRequest> requests, Budget budget) {
        if (requests == null || requests.isEmpty()) return List.of();
        return requests.stream().map(req -> {
            Category category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            String.format(CATEGORY_NOT_FOUND, req.getCategoryId())));
            BudgetCategory bc = new BudgetCategory();
            bc.setBudget(budget);
            bc.setCategory(category);
            bc.setLimitAmount(req.getLimitAmount());
            return budgetCategoryRepository.save(bc);
        }).toList();
    }

    private BudgetResponse toResponse(Budget budget, List<BudgetCategory> categories) {
        List<BudgetCategoryResponse> categoryResponses = categories.stream()
                .map(bc -> new BudgetCategoryResponse(
                        bc.getId(),
                        bc.getCategory().getId(),
                        bc.getCategory().getName(),
                        bc.getLimitAmount()))
                .toList();
        return new BudgetResponse(
                budget.getId(),
                budget.getTotalAmount(),
                budget.getMonth(),
                budget.getYear(),
                categoryResponses);
    }
}
