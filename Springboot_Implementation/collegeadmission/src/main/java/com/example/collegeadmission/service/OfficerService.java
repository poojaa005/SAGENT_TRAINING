package com.example.collegeadmission.service;

import com.example.collegeadmission.entity.Officer;
import com.example.collegeadmission.repository.OfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OfficerService {

    @Autowired
    private OfficerRepository officerRepository;

    // CREATE
    public Officer saveOfficer(Officer officer) {
        return officerRepository.save(officer);
    }

    // READ ALL
    public List<Officer> getAllOfficers() {
        return officerRepository.findAll();
    }

    // READ BY ID
    public Optional<Officer> getOfficerById(Long id) {
        return officerRepository.findById(id);
    }

    // UPDATE
    public Officer updateOfficer(Long id, Officer officerDetails) {
        Officer officer = officerRepository.findById(id).orElseThrow();

        officer.setOfficerName(officerDetails.getOfficerName());
        officer.setDesignation(officerDetails.getDesignation());
        officer.setDepartment(officerDetails.getDepartment());
        officer.setEmail(officerDetails.getEmail());
        officer.setPhoneNumber(officerDetails.getPhoneNumber());

        return officerRepository.save(officer);
    }

    // DELETE
    public void deleteOfficer(Long id) {
        officerRepository.deleteById(id);
    }
}
