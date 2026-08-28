package com.cashy.service;

import com.cashy.dto.GoalRequest;
import com.cashy.dto.GoalResponse;
import com.cashy.entity.Goal;
import com.cashy.entity.User;
import com.cashy.repository.GoalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GoalServiceTest {

    @Mock GoalRepository goalRepository;
    @Mock NotificationService notificationService;
    @Mock UserService userService;

    @InjectMocks GoalService goalService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        when(userService.getCurrentUser()).thenReturn(user);
    }

    @Test
    void getGoals_returnsGoalsForCurrentUser() {
        Goal goal = buildGoal(100.0, 40.0);
        when(goalRepository.findByUserOrderByDeadlineAsc(user)).thenReturn(List.of(goal));

        List<GoalResponse> result = goalService.getGoals();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Vacation");
    }

    @Test
    void createGoal_setsCurrentAmountToZeroWhenNotProvided() {
        GoalRequest req = new GoalRequest();
        req.setName("Car");
        req.setTargetAmount(5000.0);

        Goal saved = buildGoal(5000.0, 0.0);
        when(goalRepository.save(any())).thenReturn(saved);

        GoalResponse result = goalService.createGoal(req);

        assertThat(result.getCurrentAmount()).isEqualTo(0.0);
    }

    @Test
    void addFunds_updatesCurrentAmount() {
        Goal goal = buildGoal(100.0, 40.0);
        goal.setId(1L);

        Goal updated = buildGoal(100.0, 70.0);
        when(goalRepository.findById(1L)).thenReturn(Optional.of(goal));
        when(goalRepository.save(goal)).thenReturn(updated);

        GoalResponse result = goalService.addFunds(1L, 30.0);

        assertThat(result.getCurrentAmount()).isEqualTo(70.0);
    }

    @Test
    void addFunds_sendsNotification_whenGoalJustCompleted() {
        Goal goal = buildGoal(100.0, 80.0);
        goal.setId(1L);

        Goal completed = buildGoal(100.0, 100.0);
        when(goalRepository.findById(1L)).thenReturn(Optional.of(goal));
        when(goalRepository.save(goal)).thenReturn(completed);

        goalService.addFunds(1L, 20.0);

        verify(notificationService).createNotification(eq(user), anyString());
    }

    @Test
    void addFunds_noNotification_whenAlreadyComplete() {
        Goal goal = buildGoal(100.0, 100.0);
        goal.setId(1L);

        Goal saved = buildGoal(100.0, 110.0);
        when(goalRepository.findById(1L)).thenReturn(Optional.of(goal));
        when(goalRepository.save(goal)).thenReturn(saved);

        goalService.addFunds(1L, 10.0);

        verify(notificationService, never()).createNotification(any(), anyString());
    }

    @Test
    void addFunds_noNotification_whenStillBelowTarget() {
        Goal goal = buildGoal(100.0, 30.0);
        goal.setId(1L);

        Goal saved = buildGoal(100.0, 50.0);
        when(goalRepository.findById(1L)).thenReturn(Optional.of(goal));
        when(goalRepository.save(goal)).thenReturn(saved);

        goalService.addFunds(1L, 20.0);

        verify(notificationService, never()).createNotification(any(), anyString());
    }

    @Test
    void addFunds_throwsWhenAccessDenied() {
        User other = new User();
        other.setId(2L);
        Goal goal = buildGoal(100.0, 0.0);
        goal.setId(5L);
        goal.setUser(other);

        when(goalRepository.findById(5L)).thenReturn(Optional.of(goal));

        assertThatThrownBy(() -> goalService.addFunds(5L, 10.0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Access denied");
    }

    @Test
    void deleteGoal_throwsWhenNotFound() {
        when(goalRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> goalService.deleteGoal(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("99");
    }

    @Test
    void progressPercent_cappedAt100() {
        Goal goal = buildGoal(100.0, 150.0);
        when(goalRepository.findByUserOrderByDeadlineAsc(user)).thenReturn(List.of(goal));

        List<GoalResponse> result = goalService.getGoals();

        assertThat(result.get(0).getProgressPercent()).isEqualTo(100.0);
    }

    private Goal buildGoal(double target, double current) {
        Goal g = new Goal();
        g.setId(1L);
        g.setName("Vacation");
        g.setTargetAmount(target);
        g.setCurrentAmount(current);
        g.setDeadline(LocalDate.now().plusMonths(3));
        g.setUser(user);
        return g;
    }
}
