package com.example.collegeadmission.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.collegeadmission.entity.AcademicDetails;
import com.example.collegeadmission.repository.AcademicDetailsRepository;

@Service
public class AcademicDetailsService {

    @Autowired
    private AcademicDetailsRepository repository;

    // CREATE
    public AcademicDetails save(AcademicDetails details) {
        return repository.save(details);
    }

    // READ ALL
    public List<AcademicDetails> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    public AcademicDetails getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE
    public AcademicDetails update(Integer id, AcademicDetails details) {

        AcademicDetails existing = repository.findById(id).orElse(null);

        if (existing != null) {
            existing.setAppId(details.getAppId());
            existing.setSubject(details.getSubject());
            existing.setGrade(details.getGrade());

            return repository.save(existing);
        }

        return null;
    }

    // DELETE
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
