package com.example.collegeadmission.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.collegeadmission.entity.Application;
import com.example.collegeadmission.repository.ApplicationRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository repository;

    // CREATE
    public Application save(Application application) {
        return repository.save(application);
    }

    // READ ALL
    public List<Application> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    public Application getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE
    public Application update(Integer id, Application application) {

        Application existing = repository.findById(id).orElse(null);

        if (existing != null) {
            existing.setStId(application.getStId());
            existing.setCourseId(application.getCourseId());
            existing.setStatus(application.getStatus());

            return repository.save(existing);
        }

        return null;
    }

    // DELETE
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
