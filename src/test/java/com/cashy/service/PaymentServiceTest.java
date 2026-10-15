package com.cashy.service;

import com.cashy.dto.PaymentResponse;
import com.cashy.entity.Payment;
import com.cashy.entity.User;
import com.cashy.repository.PaymentRepository;
import com.cashy.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock PaymentRepository paymentRepository;
    @Mock UserRepository userRepository;
    @Mock NotificationService notificationService;
    @Mock UserService userService;

    @InjectMocks PaymentService paymentService;

    @Test
    void createCheckoutSession_whenStripeNotConfigured_alertsAdminsAndFails() {
        ReflectionTestUtils.setField(paymentService, "stripeSecretKey", "");
        when(userService.getCurrentUser()).thenReturn(buildUser(User.Role.USER));

        assertThatThrownBy(() -> paymentService.createCheckoutSession())
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Payments are not configured");

        verify(notificationService).notifyAdmins(contains("STRIPE_SECRET_KEY"));
    }

    @Test
    void createCheckoutSession_whenAlreadyPremium_failsWithoutAlertingAdmins() {
        when(userService.getCurrentUser()).thenReturn(buildUser(User.Role.PREMIUM));

        assertThatThrownBy(() -> paymentService.createCheckoutSession())
                .isInstanceOf(IllegalArgumentException.class);

        verify(notificationService, never()).notifyAdmins(anyString());
    }

    @Test
    void handleWebhook_withInvalidSignature_alertsAdmins() {
        ReflectionTestUtils.setField(paymentService, "stripeWebhookSecret", "whsec_test");

        assertThatThrownBy(() -> paymentService.handleWebhook("{}", "not-a-real-signature"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid Stripe signature");

        verify(notificationService).notifyAdmins(contains("invalid signature"));
    }

    @Test
    void handleWebhook_withoutWebhookSecret_alertsAdmins() {
        ReflectionTestUtils.setField(paymentService, "stripeWebhookSecret", "");

        assertThatThrownBy(() -> paymentService.handleWebhook("{}", "sig"))
                .isInstanceOf(IllegalStateException.class);

        verify(notificationService).notifyAdmins(contains("STRIPE_WEBHOOK_SECRET"));
    }

    @Test
    void confirmPayment_whenAlreadyPaid_returnsPaidWithoutCallingStripe() {
        User user = buildUser(User.Role.PREMIUM);
        Payment payment = new Payment();
        payment.setId(5L);
        payment.setStripeSessionId("cs_test_1");
        payment.setAmount(4.99);
        payment.setCurrency("eur");
        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setUser(user);
        when(userService.getCurrentUser()).thenReturn(user);
        when(paymentRepository.findByStripeSessionId("cs_test_1")).thenReturn(Optional.of(payment));

        PaymentResponse result = paymentService.confirmPayment("cs_test_1");

        assertThat(result.getStatus()).isEqualTo(Payment.PaymentStatus.PAID);
        verify(notificationService, never()).notifyAdmins(anyString());
    }

    private User buildUser(User.Role role) {
        User user = new User();
        user.setId(1L);
        user.setEmail("maria@cashy.com");
        user.setRole(role);
        return user;
    }
}
