package com.cashy.service;

import com.cashy.dto.CheckoutSessionResponse;
import com.cashy.dto.PaymentResponse;
import com.cashy.entity.Payment;
import com.cashy.entity.User;
import com.cashy.repository.PaymentRepository;
import com.cashy.repository.UserRepository;
import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final UserService userService;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret}")
    private String stripeWebhookSecret;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private static final long PREMIUM_PRICE_CENTS = 499L;
    private static final double CENTS_PER_UNIT = 100.0;
    private static final String CURRENCY = "eur";
    private static final String PRODUCT_NAME = "Cashy Premium";
    private static final String PRODUCT_DESCRIPTION = "Receipt scanning and financial forecasts";
    private static final String SUCCESS_PATH = "/premium/success?session_id={CHECKOUT_SESSION_ID}";
    private static final String CANCEL_PATH = "/premium";
    private static final String METADATA_USER_ID = "userId";
    private static final String PAYMENT_STATUS_PAID = "paid";
    private static final String UNKNOWN_USER = "unknown user";

    private static final String CHECKOUT_COMPLETED_EVENT = "checkout.session.completed";
    private static final String CHECKOUT_ASYNC_FAILED_EVENT = "checkout.session.async_payment_failed";
    private static final String PAYMENT_INTENT_FAILED_EVENT = "payment_intent.payment_failed";

    private static final String PAYMENTS_NOT_CONFIGURED = "Payments are not configured";
    private static final String WEBHOOK_NOT_CONFIGURED = "Stripe webhook secret is not configured";
    private static final String ALREADY_PREMIUM = "You already have Premium access";
    private static final String PAYMENT_NOT_FOUND = "Payment not found for session: %s";
    private static final String INVALID_SIGNATURE = "Invalid Stripe signature";
    private static final String STRIPE_ERROR = "Payment provider error: %s";
    private static final String ACCESS_DENIED = "Access denied";
    private static final String PREMIUM_ACTIVATED = "Welcome to Premium! Receipt scanning and forecasts are now unlocked.";
    private static final String USER_PAYMENT_FAILED = "Your Premium payment could not be completed. No money was taken – please try again.";

    // Messages for the admins' URGENT notifications
    private static final String ADMIN_ALERT = "URGENT – payment problem: %s (%s)";
    private static final String PROBLEM_NOT_CONFIGURED = "a user tried to buy Premium but STRIPE_SECRET_KEY is not set";
    private static final String PROBLEM_CHECKOUT_FAILED = "Stripe could not create a checkout session: %s";
    private static final String PROBLEM_VERIFY_FAILED = "Stripe could not verify session %s: %s";
    private static final String PROBLEM_WEBHOOK_NOT_CONFIGURED = "Stripe sent a webhook but STRIPE_WEBHOOK_SECRET is not set";
    private static final String PROBLEM_INVALID_SIGNATURE = "webhook with an invalid signature was rejected – possible forged request";
    private static final String PROBLEM_PAID_WITHOUT_RECORD = "Stripe charged session %s but no matching payment exists, so Premium was NOT activated";
    private static final String PROBLEM_ASYNC_FAILED = "delayed payment for session %s failed";
    private static final String PROBLEM_CARD_FAILED = "card payment failed: %s";

    public CheckoutSessionResponse createCheckoutSession() {
        User user = userService.getCurrentUser();
        if (user.getRole() != User.Role.USER) {
            throw new IllegalArgumentException(ALREADY_PREMIUM);
        }
        if (!isStripeConfigured()) {
            alertAdmins(PROBLEM_NOT_CONFIGURED, user.getEmail());
            throw new IllegalStateException(PAYMENTS_NOT_CONFIGURED);
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + SUCCESS_PATH)
                .setCancelUrl(frontendUrl + CANCEL_PATH)
                .setCustomerEmail(user.getEmail())
                .setClientReferenceId(String.valueOf(user.getId()))
                .putMetadata(METADATA_USER_ID, String.valueOf(user.getId()))
                // Copied onto the PaymentIntent so a failed card payment can be traced back to the user
                .setPaymentIntentData(SessionCreateParams.PaymentIntentData.builder()
                        .putMetadata(METADATA_USER_ID, String.valueOf(user.getId()))
                        .build())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency(CURRENCY)
                                .setUnitAmount(PREMIUM_PRICE_CENTS)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(PRODUCT_NAME)
                                        .setDescription(PRODUCT_DESCRIPTION)
                                        .build())
                                .build())
                        .build())
                .build();

        Session session;
        try {
            session = Session.create(params, requestOptions());
        } catch (StripeException e) {
            alertAdmins(String.format(PROBLEM_CHECKOUT_FAILED, e.getMessage()), user.getEmail());
            throw new IllegalStateException(String.format(STRIPE_ERROR, e.getMessage()), e);
        }

        Payment payment = new Payment();
        payment.setStripeSessionId(session.getId());
        payment.setAmount(PREMIUM_PRICE_CENTS / CENTS_PER_UNIT);
        payment.setCurrency(CURRENCY);
        payment.setUser(user);
        paymentRepository.save(payment);

        return new CheckoutSessionResponse(session.getId(), session.getUrl());
    }

    // Called by the frontend after Stripe redirects back; the payment status is verified with Stripe, never trusted from the client
    @Transactional
    public PaymentResponse confirmPayment(String sessionId) {
        User user = userService.getCurrentUser();
        Payment payment = findPayment(sessionId);
        if (!payment.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }

        if (payment.getStatus() != Payment.PaymentStatus.PAID) {
            if (!isStripeConfigured()) {
                alertAdmins(PROBLEM_NOT_CONFIGURED, user.getEmail());
                throw new IllegalStateException(PAYMENTS_NOT_CONFIGURED);
            }
            Session session;
            try {
                session = Session.retrieve(sessionId, requestOptions());
            } catch (StripeException e) {
                alertAdmins(String.format(PROBLEM_VERIFY_FAILED, sessionId, e.getMessage()), user.getEmail());
                throw new IllegalStateException(String.format(STRIPE_ERROR, e.getMessage()), e);
            }
            if (PAYMENT_STATUS_PAID.equals(session.getPaymentStatus())) {
                markPaid(payment);
            }
        }
        return toResponse(payment);
    }

    // Called by Stripe directly, so the upgrade also happens if the user closes the tab before the redirect
    @Transactional
    public void handleWebhook(String payload, String signature) {
        if (stripeWebhookSecret == null || stripeWebhookSecret.isBlank()) {
            alertAdmins(PROBLEM_WEBHOOK_NOT_CONFIGURED, UNKNOWN_USER);
            throw new IllegalStateException(WEBHOOK_NOT_CONFIGURED);
        }

        Event event;
        try {
            event = Webhook.constructEvent(payload, signature, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
            alertAdmins(PROBLEM_INVALID_SIGNATURE, UNKNOWN_USER);
            throw new IllegalArgumentException(INVALID_SIGNATURE);
        }

        switch (event.getType()) {
            case CHECKOUT_COMPLETED_EVENT -> handleCheckoutCompleted((Session) deserialize(event));
            case CHECKOUT_ASYNC_FAILED_EVENT -> handleAsyncPaymentFailed((Session) deserialize(event));
            case PAYMENT_INTENT_FAILED_EVENT -> handleCardPaymentFailed((PaymentIntent) deserialize(event));
            default -> {
                // Other Stripe events are not used by Cashy
            }
        }
    }

    public List<PaymentResponse> getPayments() {
        User user = userService.getCurrentUser();
        return paymentRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    private void handleCheckoutCompleted(Session session) {
        if (!PAYMENT_STATUS_PAID.equals(session.getPaymentStatus())) {
            return;
        }
        paymentRepository.findByStripeSessionId(session.getId()).ifPresentOrElse(
                this::markPaid,
                // The customer was charged but Cashy has no record: an admin must upgrade the account manually
                () -> alertAdmins(String.format(PROBLEM_PAID_WITHOUT_RECORD, session.getId()), describeCustomer(session.getCustomerEmail())));
    }

    private void handleAsyncPaymentFailed(Session session) {
        paymentRepository.findByStripeSessionId(session.getId()).ifPresent(payment -> {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            paymentRepository.save(payment);
            notificationService.createNotification(payment.getUser(), USER_PAYMENT_FAILED);
        });
        alertAdmins(String.format(PROBLEM_ASYNC_FAILED, session.getId()), describeCustomer(session.getCustomerEmail()));
    }

    private void handleCardPaymentFailed(PaymentIntent intent) {
        String reason = intent.getLastPaymentError() != null ? intent.getLastPaymentError().getMessage() : intent.getId();
        alertAdmins(String.format(PROBLEM_CARD_FAILED, reason), describeUserFromMetadata(intent));
    }

    // Idempotent: confirm and webhook can both arrive for the same session
    private void markPaid(Payment payment) {
        if (payment.getStatus() == Payment.PaymentStatus.PAID) {
            return;
        }
        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        User user = payment.getUser();
        if (user.getRole() == User.Role.USER) {
            user.setRole(User.Role.PREMIUM);
            userRepository.save(user);
        }
        notificationService.createNotification(user, PREMIUM_ACTIVATED);
    }

    private void alertAdmins(String problem, String who) {
        notificationService.notifyAdmins(String.format(ADMIN_ALERT, problem, who));
    }

    private String describeCustomer(String email) {
        return email != null ? email : UNKNOWN_USER;
    }

    private String describeUserFromMetadata(PaymentIntent intent) {
        String userId = intent.getMetadata() != null ? intent.getMetadata().get(METADATA_USER_ID) : null;
        if (userId == null) {
            return UNKNOWN_USER;
        }
        return userRepository.findById(Long.valueOf(userId))
                .map(User::getEmail)
                .orElse(UNKNOWN_USER);
    }

    private StripeObject deserialize(Event event) {
        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
        try {
            return deserializer.getObject().isPresent()
                    ? deserializer.getObject().get()
                    : deserializer.deserializeUnsafe();
        } catch (EventDataObjectDeserializationException e) {
            throw new IllegalStateException(String.format(STRIPE_ERROR, e.getMessage()), e);
        }
    }

    private Payment findPayment(String sessionId) {
        return paymentRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException(String.format(PAYMENT_NOT_FOUND, sessionId)));
    }

    private boolean isStripeConfigured() {
        return stripeSecretKey != null && !stripeSecretKey.isBlank();
    }

    private RequestOptions requestOptions() {
        return RequestOptions.builder().setApiKey(stripeSecretKey).build();
    }

    private PaymentResponse toResponse(Payment p) {
        return new PaymentResponse(p.getId(), p.getAmount(), p.getCurrency(), p.getStatus(), p.getCreatedAt(), p.getPaidAt());
    }
}
