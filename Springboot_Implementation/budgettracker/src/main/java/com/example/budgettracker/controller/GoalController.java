package com.example.budgettracker.controller;

import com.example.budgettracker.entity.Goal;
import com.example.budgettracker.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    // CREATE
    @PostMapping("/user/{userId}")
    public Goal createGoal(@PathVariable Long userId,
                           @RequestBody Goal goal) {
        return goalService.createGoal(userId, goal);
    }

    // READ ALL
    @GetMapping
    public List<Goal> getAllGoals() {
        return goalService.getAllGoals();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Goal getGoalById(@PathVariable Long id) {
        return goalService.getGoalById(id);
    }

    // READ BY USER
    @GetMapping("/user/{userId}")
    public List<Goal> getGoalsByUser(@PathVariable Long userId) {
        return goalService.getGoalsByUser(userId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Goal updateGoal(@PathVariable Long id,
                           @RequestBody Goal goal) {
        return goalService.updateGoal(id, goal);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return "Goal deleted successfully!";
    }
}
