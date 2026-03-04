package com.example.library.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "librarian")
public class Librarian {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long librarian_id;

    @Column(nullable = false)
    private String librarian_name;

    @Column(nullable = false, unique = true)
    private String librarian_email;

    @Column(nullable = false)
    private String librarian_password;

    // Constructors
    public Librarian() {
    }

    public Librarian(Long librarian_id, String librarian_name, String librarian_email, String librarian_password) {
        this.librarian_id = librarian_id;
        this.librarian_name = librarian_name;
        this.librarian_email = librarian_email;
        this.librarian_password = librarian_password;
    }

    // Getters and Setters

    public Long getLibrarian_id() {
        return librarian_id;
    }

    public void setLibrarian_id(Long librarian_id) {
        this.librarian_id = librarian_id;
    }

    public String getLibrarian_name() {
        return librarian_name;
    }

    public void setLibrarian_name(String librarian_name) {
        this.librarian_name = librarian_name;
    }

    public String getLibrarian_email() {
        return librarian_email;
    }

    public void setLibrarian_email(String librarian_email) {
        this.librarian_email = librarian_email;
    }

    public String getLibrarian_password() {
        return librarian_password;
    }

    public void setLibrarian_password(String librarian_password) {
        this.librarian_password = librarian_password;
    }
}
