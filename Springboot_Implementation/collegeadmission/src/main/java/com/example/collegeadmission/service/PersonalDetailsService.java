package com.example.collegeadmission.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.example.collegeadmission.entity.PersonalDetails;
import com.example.collegeadmission.repository.PersonalDetailsRepository;

@Service
public class PersonalDetailsService {

    @Autowired
    private PersonalDetailsRepository repository;

    // CREATE
    public PersonalDetails save(PersonalDetails details) {
        return repository.save(details);
    }

    // READ ALL
    public List<PersonalDetails> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    public PersonalDetails getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE
    public PersonalDetails update(Integer id, PersonalDetails details) {

        PersonalDetails existing = repository.findById(id).orElse(null);

        if (existing != null) {
            existing.setStId(details.getStId());
            existing.setDob(details.getDob());
            existing.setAddress(details.getAddress());
            existing.setPhoneNo(details.getPhoneNo());

            return repository.save(existing);
        }

        return null;
    }

    // DELETE
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
