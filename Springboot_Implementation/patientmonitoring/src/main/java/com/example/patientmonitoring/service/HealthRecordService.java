package com.example.patientmonitoring.service;

import com.example.patientmonitoring.entity.HealthRecord;
import com.example.patientmonitoring.repository.HealthRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthRecordService {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    public HealthRecord saveHealthRecord(HealthRecord healthRecord) {
        return healthRecordRepository.save(healthRecord);
    }

    public List<HealthRecord> getAllHealthRecords() {
        return healthRecordRepository.findAll();
    }

    public HealthRecord getHealthRecordById(Long id) {
        return healthRecordRepository.findById(id).orElse(null);
    }

    public void deleteHealthRecord(Long id) {
        healthRecordRepository.deleteById(id);
    }
}
