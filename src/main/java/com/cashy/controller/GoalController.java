package com.cashy.controller;

import com.cashy.dto.GoalRequest;
import com.cashy.dto.GoalResponse;
import com.cashy.service.GoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Goals", description = "Track savings goals with deadlines and progress")
@SecurityRequirement(name = "bearerAuth")
public class GoalController {

    private final GoalService goalService;

    @Operation(summary = "List all savings goals for the current user")
    @GetMapping
    public ResponseEntity<List<GoalResponse>> getGoals() {
        return ResponseEntity.ok(goalService.getGoals());
    }

    @Operation(summary = "Create a new savings goal")
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.createGoal(request));
    }

    @Operation(summary = "Update an existing savings goal")
    @PutMapping(ID_PATH)
    public ResponseEntity<GoalResponse> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.updateGoal(id, request));
    }

    @Operation(summary = "Add funds to a savings goal")
    @PatchMapping(FUNDS_PATH)
    public ResponseEntity<GoalResponse> addFunds(
            @PathVariable Long id,
            @RequestParam @Positive Double amount) {
        return ResponseEntity.ok(goalService.addFunds(id, amount));
    }

    @Operation(summary = "Delete a savings goal by ID")
    @DeleteMapping(ID_PATH)
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
}
