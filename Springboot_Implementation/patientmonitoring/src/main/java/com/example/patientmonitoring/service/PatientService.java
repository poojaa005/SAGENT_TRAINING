package com.example.patientmonitoring.service;

import com.example.patientmonitoring.entity.Patient;
import com.example.patientmonitoring.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElse(null);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    // ✅ ADD THIS LOGIN METHOD
    public Patient login(String email, String password) {

        Optional<Patient> patientOptional = patientRepository.findByEmail(email);

        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();

            // simple password check (for now)
            if (patient.getPasswordHash().equals(password)) {
                return patient;
            }
        }


        return null;
    }
}