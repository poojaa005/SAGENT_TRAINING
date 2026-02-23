package com.example.budgettracker.repository;

import com.example.budgettracker.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserUserId(Long userId);

}
