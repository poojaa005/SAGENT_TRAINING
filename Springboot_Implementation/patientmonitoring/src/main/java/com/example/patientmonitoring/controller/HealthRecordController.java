package com.example.patientmonitoring.controller;

import com.example.patientmonitoring.entity.HealthRecord;
import com.example.patientmonitoring.service.HealthRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/healthrecords")
@CrossOrigin("*")
public class HealthRecordController {

    @Autowired
    private HealthRecordService healthRecordService;

    @PostMapping
    public HealthRecord createHealthRecord(@RequestBody HealthRecord healthRecord) {
        return healthRecordService.saveHealthRecord(healthRecord);
    }

    @GetMapping
    public List<HealthRecord> getAllHealthRecords() {
        return healthRecordService.getAllHealthRecords();
    }

    @GetMapping("/{id}")
    public HealthRecord getHealthRecord(@PathVariable Long id) {
        return healthRecordService.getHealthRecordById(id);
    }

    @PutMapping("/{id}")
    public HealthRecord updateHealthRecord(@PathVariable Long id, @RequestBody HealthRecord healthRecord) {
        healthRecord.setRecordId(id);
        return healthRecordService.saveHealthRecord(healthRecord);
    }

    @DeleteMapping("/{id}")
    public String deleteHealthRecord(@PathVariable Long id) {
        healthRecordService.deleteHealthRecord(id);
        return "Health Record Deleted Successfully";
    }
}
