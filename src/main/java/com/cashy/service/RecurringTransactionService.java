package com.cashy.service;

import com.cashy.dto.RecurringTransactionRequest;
import com.cashy.dto.RecurringTransactionResponse;
import com.cashy.dto.TransactionResponse;
import com.cashy.entity.Category;
import com.cashy.entity.PaymentMethod;
import com.cashy.entity.RecurringTransaction;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import com.cashy.repository.CategoryRepository;
import com.cashy.repository.PaymentMethodRepository;
import com.cashy.repository.RecurringTransactionRepository;
import com.cashy.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecurringTransactionService {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final UserService userService;

    private static final String RECURRING_NOT_FOUND = "Recurring transaction not found: %d";
    private static final String CATEGORY_NOT_FOUND = "Category not found: %d";
    private static final String PAYMENT_METHOD_NOT_FOUND = "Payment method not found: %d";
    private static final String ACCESS_DENIED = "Access denied";

    public List<RecurringTransactionResponse> getRecurringTransactions() {
        User user = userService.getCurrentUser();
        return recurringTransactionRepository.findByUserOrderByNextDateAsc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    public RecurringTransactionResponse createRecurringTransaction(RecurringTransactionRequest request) {
        User user = userService.getCurrentUser();
        RecurringTransaction rt = new RecurringTransaction();
        rt.setAmount(request.getAmount());
        rt.setDescription(request.getDescription());
        rt.setFrequency(request.getFrequency());
        rt.setType(request.getType());
        rt.setNextDate(request.getNextDate() != null ? request.getNextDate() : LocalDate.now());
        rt.setUser(user);
        rt.setCategory(resolveCategory(request.getCategoryId()));
        rt.setPaymentMethod(resolvePaymentMethod(request.getPaymentMethodId()));
        return toResponse(recurringTransactionRepository.save(rt));
    }

    public RecurringTransactionResponse updateRecurringTransaction(Long id, RecurringTransactionRequest request) {
        User user = userService.getCurrentUser();
        RecurringTransaction rt = recurringTransactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(RECURRING_NOT_FOUND, id)));
        if (!rt.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        rt.setAmount(request.getAmount());
        rt.setDescription(request.getDescription());
        rt.setFrequency(request.getFrequency());
        rt.setType(request.getType());
        if (request.getNextDate() != null) {
            rt.setNextDate(request.getNextDate());
        }
        rt.setCategory(resolveCategory(request.getCategoryId()));
        rt.setPaymentMethod(resolvePaymentMethod(request.getPaymentMethodId()));
        return toResponse(recurringTransactionRepository.save(rt));
    }

    @Transactional
    public TransactionResponse applyRecurringTransaction(Long id) {
        User user = userService.getCurrentUser();
        RecurringTransaction rt = recurringTransactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(RECURRING_NOT_FOUND, id)));
        if (!rt.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }

        Transaction transaction = new Transaction();
        transaction.setAmount(rt.getAmount());
        transaction.setDescription(rt.getDescription());
        transaction.setDate(LocalDate.now());
        transaction.setType(rt.getType() != null ? rt.getType() : Transaction.TransactionType.EXPENSE);
        transaction.setUser(user);
        transaction.setCategory(rt.getCategory());
        transaction.setPaymentMethod(rt.getPaymentMethod());
        Transaction saved = transactionRepository.save(transaction);

        LocalDate nextDate = switch (rt.getFrequency()) {
            case WEEKLY -> LocalDate.now().plusWeeks(1);
            case MONTHLY -> LocalDate.now().plusMonths(1);
        };
        rt.setNextDate(nextDate);
        recurringTransactionRepository.save(rt);

        return toTransactionResponse(saved);
    }

    public void deleteRecurringTransaction(Long id) {
        User user = userService.getCurrentUser();
        RecurringTransaction rt = recurringTransactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(RECURRING_NOT_FOUND, id)));
        if (!rt.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        recurringTransactionRepository.delete(rt);
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException(String.format(CATEGORY_NOT_FOUND, categoryId)));
    }

    private PaymentMethod resolvePaymentMethod(Long paymentMethodId) {
        if (paymentMethodId == null) return null;
        return paymentMethodRepository.findById(paymentMethodId)
                .orElseThrow(() -> new IllegalArgumentException(String.format(PAYMENT_METHOD_NOT_FOUND, paymentMethodId)));
    }

    private RecurringTransactionResponse toResponse(RecurringTransaction rt) {
        return new RecurringTransactionResponse(
                rt.getId(),
                rt.getAmount(),
                rt.getDescription(),
                rt.getFrequency(),
                rt.getType(),
                rt.getNextDate(),
                rt.getCreatedAt(),
                rt.getCategory() != null ? rt.getCategory().getId() : null,
                rt.getCategory() != null ? rt.getCategory().getName() : null,
                rt.getPaymentMethod() != null ? rt.getPaymentMethod().getId() : null,
                rt.getPaymentMethod() != null ? rt.getPaymentMethod().getName() : null
        );
    }

    private TransactionResponse toTransactionResponse(Transaction t) {
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
