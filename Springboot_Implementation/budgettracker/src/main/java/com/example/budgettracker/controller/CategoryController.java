package com.example.budgettracker.controller;

import com.example.budgettracker.entity.Category;
import com.example.budgettracker.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // CREATE
    @PostMapping("/user/{userId}")
    public Category createCategory(@PathVariable Long userId,
                                   @RequestBody Category category) {
        return categoryService.createCategory(userId, category);
    }

    // READ ALL
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    // READ BY USER
    @GetMapping("/user/{userId}")
    public List<Category> getCategoryByUser(@PathVariable Long userId) {
        return categoryService.getCategoryByUser(userId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id,
                                   @RequestBody Category category) {
        return categoryService.updateCategory(id, category);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "Category deleted successfully!";
    }
}
