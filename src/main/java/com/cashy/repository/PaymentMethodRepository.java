package com.cashy.repository;

import com.cashy.entity.PaymentMethod;
import com.cashy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {

    List<PaymentMethod> findByUser(User user);

    Optional<PaymentMethod> findByIdAndUser(Long id, User user);

    boolean existsByNameAndUser(String name, User user);
}
