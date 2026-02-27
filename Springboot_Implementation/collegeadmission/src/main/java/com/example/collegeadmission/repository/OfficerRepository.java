package com.example.collegeadmission.repository;

import com.example.collegeadmission.entity.Officer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfficerRepository extends JpaRepository<Officer, Long> {
    Optional<Officer> findByOfficerGmail(String officerGmail);
    Optional<Officer> findByOfficerGmailAndOfficerPassword(String officerGmail, String officerPassword);
}
