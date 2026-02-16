package com.example.patientmonitoring.controller;

import com.example.patientmonitoring.entity.Consultation;
import com.example.patientmonitoring.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin("*")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @PostMapping
    public Consultation createConsultation(@RequestBody Consultation consultation) {
        return consultationService.saveConsultation(consultation);
    }

    @GetMapping
    public List<Consultation> getAllConsultations() {
        return consultationService.getAllConsultations();
    }

    @GetMapping("/{id}")
    public Consultation getConsultation(@PathVariable Long id) {
        return consultationService.getConsultationById(id);
    }

    @PutMapping("/{id}")
    public Consultation updateConsultation(@PathVariable Long id,
                                           @RequestBody Consultation consultation) {
        consultation.setConsultationId(id);
        return consultationService.saveConsultation(consultation);
    }

    @DeleteMapping("/{id}")
    public String deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return "Consultation Deleted Successfully";
    }
}
