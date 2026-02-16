package com.example.budgettracker.repository;

import com.example.budgettracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserUserId(Long userId);

}
