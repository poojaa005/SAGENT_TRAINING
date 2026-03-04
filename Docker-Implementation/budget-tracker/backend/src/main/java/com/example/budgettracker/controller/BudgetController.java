package com.example.budgettracker.controller;

import com.example.budgettracker.entity.Budget;
import com.example.budgettracker.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // CREATE
    @PostMapping("/user/{userId}")
    public Budget createBudget(@PathVariable Long userId,
                               @RequestBody Budget budget) {
        return budgetService.createBudget(userId, budget);
    }

    // READ ALL
    @GetMapping
    public List<Budget> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Budget getBudgetById(@PathVariable Long id) {
        return budgetService.getBudgetById(id);
    }

    // READ BY USER
    @GetMapping("/user/{userId}")
    public List<Budget> getBudgetByUser(@PathVariable Long userId) {
        return budgetService.getBudgetByUser(userId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Budget updateBudget(@PathVariable Long id,
                               @RequestBody Budget budget) {
        return budgetService.updateBudget(id, budget);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return "Budget deleted successfully!";
    }
}
