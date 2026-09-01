package com.cashy.scheduler;

import com.cashy.service.RecurringTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecurringTransactionScheduler {

    private static final String DAILY_AT_6AM = "0 0 6 * * *";

    private final RecurringTransactionService recurringTransactionService;

    @Scheduled(cron = DAILY_AT_6AM)
    public void applyDueRecurringTransactions() {
        recurringTransactionService.applyDueRecurringTransactions();
    }
}
