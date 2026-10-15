package com.cashy.repository;

import com.cashy.entity.Payment;
import com.cashy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserOrderByCreatedAtDesc(User user);

    Optional<Payment> findByStripeSessionId(String stripeSessionId);
}
