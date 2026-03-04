package com.example.budgettracker.repository;

import com.example.budgettracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserUserId(Long userId);

}
