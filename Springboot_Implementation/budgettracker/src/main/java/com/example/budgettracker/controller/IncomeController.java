package com.example.budgettracker.controller;

import com.example.budgettracker.entity.Income;
import com.example.budgettracker.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/income")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    // CREATE
    @PostMapping("/user/{userId}")
    public Income createIncome(@PathVariable Long userId,
                               @RequestBody Income income) {
        return incomeService.createIncome(userId, income);
    }

    // READ ALL
    @GetMapping
    public List<Income> getAllIncome() {
        return incomeService.getAllIncome();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Income getIncomeById(@PathVariable Long id) {
        return incomeService.getIncomeById(id);
    }

    // READ BY USER
    @GetMapping("/user/{userId}")
    public List<Income> getIncomeByUser(@PathVariable Long userId) {
        return incomeService.getIncomeByUser(userId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Income updateIncome(@PathVariable Long id,
                               @RequestBody Income income) {
        return incomeService.updateIncome(id, income);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return "Income deleted successfully!";
    }
}
