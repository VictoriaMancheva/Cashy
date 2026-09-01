package com.cashy.scheduler;

import com.cashy.entity.Goal;
import com.cashy.repository.GoalRepository;
import com.cashy.repository.RecurringTransactionRepository;
import com.cashy.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private static final String DAILY_AT_8AM = "0 0 8 * * *";
    private static final int DEADLINE_WARNING_DAYS = 7;

    private final GoalRepository goalRepository;
    private final RecurringTransactionRepository recurringTransactionRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = DAILY_AT_8AM)
    public void runDailyNotifications() {
        checkApproachingGoalDeadlines();
        checkUpcomingRecurringTransactions();
    }

    private void checkApproachingGoalDeadlines() {
        LocalDate today = LocalDate.now();
        LocalDate warningCutoff = today.plusDays(DEADLINE_WARNING_DAYS);

        goalRepository.findByDeadlineBetween(today.plusDays(1), warningCutoff).stream()
                .filter(g -> g.getCurrentAmount() < g.getTargetAmount())
                .filter(g -> !today.equals(g.getLastDeadlineNotification()))
                .forEach(goal -> {
                    long daysLeft = ChronoUnit.DAYS.between(today, goal.getDeadline());
                    double progress = goal.getTargetAmount() > 0
                            ? (goal.getCurrentAmount() / goal.getTargetAmount()) * 100 : 0;
                    notificationService.createNotification(goal.getUser(),
                            String.format("Goal \"%s\" deadline in %d day%s. Progress: %.2f / %.2f (%.0f%%).",
                                    goal.getName(), daysLeft, daysLeft == 1 ? "" : "s",
                                    goal.getCurrentAmount(), goal.getTargetAmount(), progress));
                    goal.setLastDeadlineNotification(today);
                    goalRepository.save(goal);
                });
    }

    private void checkUpcomingRecurringTransactions() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        recurringTransactionRepository.findByNextDate(tomorrow).forEach(rt -> {
            String desc = rt.getDescription() != null ? rt.getDescription() : "Recurring transaction";
            notificationService.createNotification(rt.getUser(),
                    String.format("Reminder: \"%s\" — %.2f will be automatically applied tomorrow.", desc, rt.getAmount()));
        });
    }
}
