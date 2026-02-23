package com.example.collegeadmission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegeadmission.entity.AcademicDetails;

public interface AcademicDetailsRepository
        extends JpaRepository<AcademicDetails, Integer> {
}
