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

    private String clean(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void validateRequired(Officer officer) {
        if (clean(officer.getOfficerName()) == null) {
            throw new IllegalArgumentException("officerName is required");
        }
        if (clean(officer.getOfficerGmail()) == null) {
            throw new IllegalArgumentException("officerGmail is required");
        }
        if (clean(officer.getOfficerPassword()) == null) {
            throw new IllegalArgumentException("officerPassword is required");
        }
    }

    // CREATE
    public Officer saveOfficer(Officer officer) {
        officer.setOfficerName(clean(officer.getOfficerName()));
        officer.setOfficerGmail(clean(officer.getOfficerGmail()));
        officer.setOfficerPassword(clean(officer.getOfficerPassword()));

        validateRequired(officer);

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

    public Optional<Officer> getOfficerByGmail(String officerGmail) {
        return officerRepository.findByOfficerGmail(clean(officerGmail));
    }

    public Optional<Officer> loginOfficer(String officerGmail, String officerPassword) {
        return officerRepository.findByOfficerGmailAndOfficerPassword(
                clean(officerGmail),
                clean(officerPassword)
        );
    }

    // UPDATE
    public Officer updateOfficer(Long id, Officer officerDetails) {

        Officer officer = officerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        String officerName = clean(officerDetails.getOfficerName());
        String officerGmail = clean(officerDetails.getOfficerGmail());
        String officerPassword = clean(officerDetails.getOfficerPassword());

        if (officerName != null) officer.setOfficerName(officerName);
        if (officerGmail != null) officer.setOfficerGmail(officerGmail);
        if (officerPassword != null) officer.setOfficerPassword(officerPassword);

        validateRequired(officer);

        return officerRepository.save(officer);
    }

    // DELETE
    public void deleteOfficer(Long id) {
        officerRepository.deleteById(id);
    }
}
