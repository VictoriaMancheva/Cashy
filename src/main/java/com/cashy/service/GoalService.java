package com.cashy.service;

import com.cashy.dto.GoalRequest;
import com.cashy.dto.GoalResponse;
import com.cashy.entity.Goal;
import com.cashy.entity.User;
import com.cashy.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserService userService;

    private static final String GOAL_NOT_FOUND = "Goal not found: %d";
    private static final String ACCESS_DENIED = "Access denied";

    public List<GoalResponse> getGoals() {
        User user = userService.getCurrentUser();
        return goalRepository.findByUserOrderByDeadlineAsc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    public GoalResponse createGoal(GoalRequest request) {
        User user = userService.getCurrentUser();
        Goal goal = new Goal();
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : 0.0);
        goal.setDeadline(request.getDeadline());
        goal.setUser(user);
        return toResponse(goalRepository.save(goal));
    }

    public GoalResponse updateGoal(Long id, GoalRequest request) {
        User user = userService.getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(GOAL_NOT_FOUND, id)));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        if (request.getCurrentAmount() != null) {
            goal.setCurrentAmount(request.getCurrentAmount());
        }
        goal.setDeadline(request.getDeadline());
        return toResponse(goalRepository.save(goal));
    }

    public GoalResponse addFunds(Long id, Double amount) {
        User user = userService.getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(GOAL_NOT_FOUND, id)));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        goal.setCurrentAmount(goal.getCurrentAmount() + amount);
        return toResponse(goalRepository.save(goal));
    }

    public void deleteGoal(Long id) {
        User user = userService.getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(GOAL_NOT_FOUND, id)));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        goalRepository.delete(goal);
    }

    private GoalResponse toResponse(Goal goal) {
        double progress = goal.getTargetAmount() > 0
                ? Math.min(100.0, (goal.getCurrentAmount() / goal.getTargetAmount()) * 100)
                : 0.0;
        return new GoalResponse(
                goal.getId(),
                goal.getName(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                goal.getDeadline(),
                Math.round(progress * 100.0) / 100.0);
    }
}
