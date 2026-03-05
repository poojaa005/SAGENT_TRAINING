package com.example.collegeadmission.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.collegeadmission.entity.Student;
import com.example.collegeadmission.service.StudentService;

@RestController
@RequestMapping("/students")
@CrossOrigin("*")
public class StudentController {

    @Autowired
    private StudentService service;

    @PostMapping
    public Student create(@RequestBody Student student) {
        return service.saveStudent(student);
    }

    @GetMapping
    public List<Student> getAll() {
        return service.getAllStudents();
    }

    @GetMapping("/{id}")
    public Student getById(@PathVariable Integer id) {
        return service.getStudentById(id);
    }

    @PutMapping("/{id}")
    public Student update(@PathVariable Integer id, @RequestBody Student student) {
        return service.updateStudent(id, student);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.deleteStudent(id);
        return "Student deleted successfully";
    }
}
