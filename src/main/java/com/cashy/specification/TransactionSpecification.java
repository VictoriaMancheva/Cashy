package com.cashy.specification;

import com.cashy.dto.TransactionFilterParams;
import com.cashy.entity.Transaction;
import com.cashy.entity.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TransactionSpecification {

    private TransactionSpecification() {}

    public static Specification<Transaction> withFilters(User user, TransactionFilterParams params) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user"), user));

            if (params.type() != null) {
                predicates.add(cb.equal(root.get("type"), params.type()));
            }
            if (params.from() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), params.from()));
            }
            if (params.to() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), params.to()));
            }
            if (params.categoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), params.categoryId()));
            }
            if (params.paymentMethodId() != null) {
                predicates.add(cb.equal(root.get("paymentMethod").get("id"), params.paymentMethodId()));
            }
            if (params.minAmount() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), params.minAmount()));
            }
            if (params.maxAmount() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("amount"), params.maxAmount()));
            }
            if (params.search() != null && !params.search().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("description")), "%" + params.search().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
