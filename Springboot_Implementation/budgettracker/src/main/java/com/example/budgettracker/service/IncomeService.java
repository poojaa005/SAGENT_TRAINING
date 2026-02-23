package com.example.budgettracker.service;

import com.example.budgettracker.entity.Income;
import com.example.budgettracker.entity.User;
import com.example.budgettracker.repository.IncomeRepository;
import com.example.budgettracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    // CREATE
    public Income createIncome(Long userId, Income income) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        income.setUser(user);
        return incomeRepository.save(income);
    }

    // READ ALL
    public List<Income> getAllIncome() {
        return incomeRepository.findAll();
    }

    // READ BY ID
    public Income getIncomeById(Long id) {
        return incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));
    }

    // READ BY USER
    public List<Income> getIncomeByUser(Long userId) {
        return incomeRepository.findByUserUserId(userId);
    }

    // UPDATE
    public Income updateIncome(Long id, Income updatedIncome) {
        return incomeRepository.findById(id)
                .map(income -> {
                    income.setSource(updatedIncome.getSource());
                    income.setAmount(updatedIncome.getAmount());
                    income.setDate(updatedIncome.getDate());
                    income.setDescription(updatedIncome.getDescription());
                    return incomeRepository.save(income);
                })
                .orElseThrow(() -> new RuntimeException("Income not found"));
    }

    // DELETE
    public void deleteIncome(Long id) {
        incomeRepository.deleteById(id);
    }
}
