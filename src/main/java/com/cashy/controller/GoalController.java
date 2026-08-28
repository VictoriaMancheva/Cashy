package com.cashy.controller;

import com.cashy.dto.GoalRequest;
import com.cashy.dto.GoalResponse;
import com.cashy.service.GoalService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.cashy.util.Constant.*;

@RestController
@RequestMapping(GOALS_PATH)
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getGoals() {
        return ResponseEntity.ok(goalService.getGoals());
    }

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.createGoal(request));
    }

    @PutMapping(ID_PATH)
    public ResponseEntity<GoalResponse> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.updateGoal(id, request));
    }

    @PatchMapping(FUNDS_PATH)
    public ResponseEntity<GoalResponse> addFunds(
            @PathVariable Long id,
            @RequestParam @Positive Double amount) {
        return ResponseEntity.ok(goalService.addFunds(id, amount));
    }

    @DeleteMapping(ID_PATH)
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
}
