package com.example.patientmonitoring.service;

import com.example.patientmonitoring.entity.Consultation;
import com.example.patientmonitoring.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    public Consultation saveConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public Consultation getConsultationById(Long id) {
        return consultationRepository.findById(id).orElse(null);
    }

    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }
}
