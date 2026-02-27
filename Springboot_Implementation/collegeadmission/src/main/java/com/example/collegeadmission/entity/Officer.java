package com.example.collegeadmission.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "officer")
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "officer_id")
    private Long officerId;

    @Column(name = "officer_name")
    private String officerName;

    @Column(name = "officer_gmail")
    private String officerGmail;

    @Column(name = "officer_password")
    private String officerPassword;

    // Default Constructor
    public Officer() {
    }

    // Constructor
    public Officer(String officerName, String officerGmail, String officerPassword) {
        this.officerName = officerName;
        this.officerGmail = officerGmail;
        this.officerPassword = officerPassword;
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

    public String getOfficerGmail() {
        return officerGmail;
    }

    public void setOfficerGmail(String officerGmail) {
        this.officerGmail = officerGmail;
    }

    public String getOfficerPassword() {
        return officerPassword;
    }

    public void setOfficerPassword(String officerPassword) {
        this.officerPassword = officerPassword;
    }
}