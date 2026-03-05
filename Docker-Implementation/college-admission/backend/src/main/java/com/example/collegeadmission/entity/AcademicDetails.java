package com.example.collegeadmission.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "academic_details")
public class AcademicDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "academic_record_id")
    private Integer academicRecordId;

    @Column(name = "app_id")
    private Integer appId;

    private String subject;

    private String grade;

    // ---------------- GETTERS & SETTERS ----------------

    public Integer getAcademicRecordId() {
        return academicRecordId;
    }

    public void setAcademicRecordId(Integer academicRecordId) {
        this.academicRecordId = academicRecordId;
    }

    public Integer getAppId() {
        return appId;
    }

    public void setAppId(Integer appId) {
        this.appId = appId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}
