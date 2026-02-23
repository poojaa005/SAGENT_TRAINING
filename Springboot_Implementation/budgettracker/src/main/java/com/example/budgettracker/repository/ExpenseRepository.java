package com.example.budgettracker.repository;

import com.example.budgettracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserUserId(Long userId);

}
