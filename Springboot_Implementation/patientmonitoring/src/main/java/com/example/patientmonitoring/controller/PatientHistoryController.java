package com.example.patientmonitoring.controller;

import com.example.patientmonitoring.entity.PatientHistory;
import com.example.patientmonitoring.service.PatientHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patienthistory")
@CrossOrigin("*")
public class PatientHistoryController {

    @Autowired
    private PatientHistoryService patientHistoryService;

    @PostMapping
    public PatientHistory createPatientHistory(@RequestBody PatientHistory patientHistory) {
        return patientHistoryService.savePatientHistory(patientHistory);
    }

    @GetMapping
    public List<PatientHistory> getAllPatientHistories() {
        return patientHistoryService.getAllPatientHistories();
    }

    @GetMapping("/{id}")
    public PatientHistory getPatientHistory(@PathVariable Long id) {
        return patientHistoryService.getPatientHistoryById(id);
    }

    @PutMapping("/{id}")
    public PatientHistory updatePatientHistory(@PathVariable Long id,
                                               @RequestBody PatientHistory patientHistory) {
        patientHistory.setHistoryId(id);
        return patientHistoryService.savePatientHistory(patientHistory);
    }

    @DeleteMapping("/{id}")
    public String deletePatientHistory(@PathVariable Long id) {
        patientHistoryService.deletePatientHistory(id);
        return "Patient History Deleted Successfully";
    }
}
