package com.example.collegeadmission.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "personal_details")
public class PersonalDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "personal_id")
    private Integer personalId;

    @Column(name = "st_id")
    private Integer stId;

    private LocalDate dob;

    private String address;

    @Column(name = "phone_no")
    private String phoneNo;

    // ---------------- GETTERS & SETTERS ----------------

    public Integer getPersonalId() {
        return personalId;
    }

    public void setPersonalId(Integer personalId) {
        this.personalId = personalId;
    }

    public Integer getStId() {
        return stId;
    }

    public void setStId(Integer stId) {
        this.stId = stId;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }
}
