package com.example.collegeadmission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegeadmission.entity.PersonalDetails;

public interface PersonalDetailsRepository
        extends JpaRepository<PersonalDetails, Integer> {

}
