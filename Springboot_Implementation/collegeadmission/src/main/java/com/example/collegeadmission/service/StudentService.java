package com.example.collegeadmission.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.collegeadmission.entity.Student;
import com.example.collegeadmission.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;

    public Student saveStudent(Student student) {
        return repository.save(student);
    }

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student getStudentById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public Student updateStudent(Integer id, Student student) {
        Student existing = repository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(student.getName());
            existing.setEmail(student.getEmail());
            existing.setPassword(student.getPassword());
            return repository.save(existing);
        }
        return null;
    }

    public void deleteStudent(Integer id) {
        repository.deleteById(id);
    }
}
