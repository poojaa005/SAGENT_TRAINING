package com.example.patientmonitoring.service;

import com.example.patientmonitoring.entity.PatientHistory;
import com.example.patientmonitoring.repository.PatientHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientHistoryService {

    @Autowired
    private PatientHistoryRepository patientHistoryRepository;

    public PatientHistory savePatientHistory(PatientHistory patientHistory) {
        return patientHistoryRepository.save(patientHistory);
    }

    public List<PatientHistory> getAllPatientHistories() {
        return patientHistoryRepository.findAll();
    }

    public PatientHistory getPatientHistoryById(Long id) {
        return patientHistoryRepository.findById(id).orElse(null);
    }

    public void deletePatientHistory(Long id) {
        patientHistoryRepository.deleteById(id);
    }
}
