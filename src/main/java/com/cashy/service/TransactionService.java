package com.cashy.service;

import com.cashy.dto.TransactionRequest;
import com.cashy.dto.TransactionResponse;
import com.cashy.entity.Category;
import com.cashy.entity.PaymentMethod;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import com.cashy.repository.CategoryRepository;
import com.cashy.repository.PaymentMethodRepository;
import com.cashy.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final UserService userService;

    private static final String TRANSACTION_NOT_FOUND = "Transaction not found: %d";
    private static final String CATEGORY_NOT_FOUND = "Category not found: %d";
    private static final String PAYMENT_METHOD_NOT_FOUND = "Payment method not found: %d";
    private static final String ACCESS_DENIED = "Access denied";

    public List<TransactionResponse> getTransactions() {
        User user = userService.getCurrentUser();
        return transactionRepository.findByUserOrderByDateDesc(user).stream()
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
        transaction.setCategory(resolveCategory(request.getCategoryId()));
        transaction.setPaymentMethod(resolvePaymentMethod(request.getPaymentMethodId()));
        return toResponse(transactionRepository.save(transaction));
    }

    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        User user = userService.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(TRANSACTION_NOT_FOUND, id)));
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setReceiptImage(request.getReceiptImage());
        transaction.setCategory(resolveCategory(request.getCategoryId()));
        transaction.setPaymentMethod(resolvePaymentMethod(request.getPaymentMethodId()));
        return toResponse(transactionRepository.save(transaction));
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
