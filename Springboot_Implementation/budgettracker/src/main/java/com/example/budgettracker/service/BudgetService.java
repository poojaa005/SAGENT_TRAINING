package com.example.budgettracker.service;

import com.example.budgettracker.entity.Budget;
import com.example.budgettracker.entity.User;
import com.example.budgettracker.repository.BudgetRepository;
import com.example.budgettracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    // CREATE
    public Budget createBudget(Long userId, Budget budget) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    // READ ALL
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    // READ BY ID
    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
    }

    // READ BY USER
    public List<Budget> getBudgetByUser(Long userId) {
        return budgetRepository.findByUserUserId(userId);
    }

    // UPDATE
    public Budget updateBudget(Long id, Budget updatedBudget) {
        return budgetRepository.findById(id)
                .map(budget -> {
                    budget.setTotalAmount(updatedBudget.getTotalAmount());
                    budget.setMonth(updatedBudget.getMonth());
                    budget.setStartDate(updatedBudget.getStartDate());
                    budget.setEndDate(updatedBudget.getEndDate());
                    return budgetRepository.save(budget);
                })
                .orElseThrow(() -> new RuntimeException("Budget not found"));
    }

    // DELETE
    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}
