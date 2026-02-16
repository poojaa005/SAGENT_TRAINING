package com.example.collegeadmission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegeadmission.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Integer> {
}
