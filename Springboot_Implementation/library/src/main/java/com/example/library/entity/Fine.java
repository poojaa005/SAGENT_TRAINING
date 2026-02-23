package com.example.library.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "fine")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fine_id;

    private LocalDate due_date;

    private LocalDate return_date;

    private Double amount;

    // One Fine -> One BorrowRequest
    @OneToOne
    @JoinColumn(name = "request_id", nullable = false)
    private BorrowRequest borrowRequest;

    // Constructors
    public Fine() {
    }

    public Fine(Long fine_id, LocalDate due_date, LocalDate return_date,
                Double amount, BorrowRequest borrowRequest) {
        this.fine_id = fine_id;
        this.due_date = due_date;
        this.return_date = return_date;
        this.amount = amount;
        this.borrowRequest = borrowRequest;
    }

    // Getters and Setters

    public Long getFine_id() {
        return fine_id;
    }

    public void setFine_id(Long fine_id) {
        this.fine_id = fine_id;
    }

    public LocalDate getDue_date() {
        return due_date;
    }

    public void setDue_date(LocalDate due_date) {
        this.due_date = due_date;
    }

    public LocalDate getReturn_date() {
        return return_date;
    }

    public void setReturn_date(LocalDate return_date) {
        this.return_date = return_date;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public BorrowRequest getBorrowRequest() {
        return borrowRequest;
    }

    public void setBorrowRequest(BorrowRequest borrowRequest) {
        this.borrowRequest = borrowRequest;
    }
}
