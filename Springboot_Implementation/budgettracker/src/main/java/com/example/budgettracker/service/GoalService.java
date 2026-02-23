package com.example.budgettracker.service;

import com.example.budgettracker.entity.Goal;
import com.example.budgettracker.entity.User;
import com.example.budgettracker.repository.GoalRepository;
import com.example.budgettracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    // CREATE
    public Goal createGoal(Long userId, Goal goal) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        goal.setUser(user);
        goal.setSavedAmount(0.0);   // default
        goal.setStatus("ACTIVE");

        return goalRepository.save(goal);
    }

    // READ ALL
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    // READ BY ID
    public Goal getGoalById(Long id) {
        return goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }

    // READ BY USER
    public List<Goal> getGoalsByUser(Long userId) {
        return goalRepository.findByUserUserId(userId);
    }

    // UPDATE
    public Goal updateGoal(Long id, Goal updatedGoal) {
        return goalRepository.findById(id)
                .map(goal -> {
                    goal.setGoalName(updatedGoal.getGoalName());
                    goal.setTargetAmount(updatedGoal.getTargetAmount());
                    goal.setSavedAmount(updatedGoal.getSavedAmount());
                    goal.setTargetDate(updatedGoal.getTargetDate());

                    if (goal.getSavedAmount() >= goal.getTargetAmount()) {
                        goal.setStatus("COMPLETED");
                    }

                    return goalRepository.save(goal);
                })
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }

    // DELETE
    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}
