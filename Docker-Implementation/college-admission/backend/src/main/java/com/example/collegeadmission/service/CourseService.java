package com.example.collegeadmission.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.collegeadmission.entity.Course;
import com.example.collegeadmission.repository.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository repository;

    // CREATE
    public Course save(Course course) {
        return repository.save(course);
    }

    // READ ALL
    public List<Course> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    public Course getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE
    public Course update(Integer id, Course course) {

        Course existing = repository.findById(id).orElse(null);

        if (existing != null) {
            existing.setCourseName(course.getCourseName());
            existing.setDept(course.getDept());
            existing.setDuration(course.getDuration());

            return repository.save(existing);
        }

        return null;
    }

    // DELETE
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
