package com.example.collegeadmission.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "officer")
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long officerId;

    private String officerName;
    private String designation;
    private String department;
    private String email;
    private String phoneNumber;

    // Constructors
    public Officer() {
    }

    public Officer(String officerName, String designation, String department, String email, String phoneNumber) {
        this.officerName = officerName;
        this.designation = designation;
        this.department = department;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    // Getters and Setters

    public Long getOfficerId() {
        return officerId;
    }

    public void setOfficerId(Long officerId) {
        this.officerId = officerId;
    }

    public String getOfficerName() {
        return officerName;
    }

    public void setOfficerName(String officerName) {
        this.officerName = officerName;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
