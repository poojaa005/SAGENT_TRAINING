package com.example.patientmonitoring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "patient_history")
public class PatientHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    private String diagnosis;
    private String treatment;
    private String allergies;
    private String medicalNotes;

    // Many PatientHistory → One Patient
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    // Many PatientHistory → One Doctor
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;


    // ======================
    // GETTERS AND SETTERS
    // ======================

    public Long getHistoryId() {
        return historyId;
    }

    public void setHistoryId(Long historyId) {
        this.historyId = historyId;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getMedicalNotes() {
        return medicalNotes;
    }

    public void setMedicalNotes(String medicalNotes) {
        this.medicalNotes = medicalNotes;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}
