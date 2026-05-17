package com.cashy.service;

import com.cashy.dto.PaymentMethodRequest;
import com.cashy.dto.PaymentMethodResponse;
import com.cashy.entity.PaymentMethod;
import com.cashy.entity.User;
import com.cashy.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final UserService userService;

    private static final String PAYMENT_METHOD_NOT_FOUND = "Payment method not found: %d";
    private static final String PAYMENT_METHOD_NAME_TAKEN = "Payment method name already exists: %s";
    private static final String ACCESS_DENIED = "Access denied";

    public List<PaymentMethodResponse> getPaymentMethods() {
        User user = userService.getCurrentUser();
        return paymentMethodRepository.findByUser(user).stream()
                .map(p -> new PaymentMethodResponse(p.getId(), p.getName()))
                .toList();
    }

    public PaymentMethodResponse createPaymentMethod(PaymentMethodRequest request) {
        User user = userService.getCurrentUser();
        if (paymentMethodRepository.existsByNameAndUser(request.getName(), user)) {
            throw new IllegalArgumentException(String.format(PAYMENT_METHOD_NAME_TAKEN, request.getName()));
        }
        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethod.setName(request.getName());
        paymentMethod.setUser(user);
        PaymentMethod saved = paymentMethodRepository.save(paymentMethod);
        return new PaymentMethodResponse(saved.getId(), saved.getName());
    }

    public PaymentMethodResponse updatePaymentMethod(Long id, PaymentMethodRequest request) {
        User user = userService.getCurrentUser();
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(PAYMENT_METHOD_NOT_FOUND, id)));
        if (!paymentMethod.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        paymentMethod.setName(request.getName());
        PaymentMethod saved = paymentMethodRepository.save(paymentMethod);
        return new PaymentMethodResponse(saved.getId(), saved.getName());
    }

    public void deletePaymentMethod(Long id) {
        User user = userService.getCurrentUser();
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(PAYMENT_METHOD_NOT_FOUND, id)));
        if (!paymentMethod.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        paymentMethodRepository.delete(paymentMethod);
    }

    public PaymentMethod findById(Long id) {
        return paymentMethodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(PAYMENT_METHOD_NOT_FOUND, id)));
    }
}
