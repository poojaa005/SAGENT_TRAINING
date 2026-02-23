package com.example.collegeadmission.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.collegeadmission.entity.Course;
import com.example.collegeadmission.service.CourseService;

@RestController
@RequestMapping("/courses")
@CrossOrigin("*")
public class CourseController {

    @Autowired
    private CourseService service;

    // CREATE
    @PostMapping
    public Course create(@RequestBody Course course) {
        return service.save(course);
    }

    // READ ALL
    @GetMapping
    public List<Course> getAll() {
        return service.getAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Course getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Course update(@PathVariable Integer id,
                         @RequestBody Course course) {
        return service.update(id, course);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.delete(id);
        return "Course deleted successfully";
    }
}
