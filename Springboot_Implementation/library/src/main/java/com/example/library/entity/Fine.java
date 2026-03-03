package com.example.library.entity;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "fine")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fine_id")
    private Long fineId;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    private Double amount;

    @OneToOne
    @JoinColumn(name = "request_id", nullable = false)
    private BorrowRequest borrowRequest;

    // Constructor
    public Fine() {}

    public Fine(Long fineId, LocalDate dueDate, LocalDate returnDate,
                Double amount, BorrowRequest borrowRequest) {
        this.fineId = fineId;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.amount = amount;
        this.borrowRequest = borrowRequest;
    }

    // Getters & Setters

    public Long getFineId() {
        return fineId;
    }

    public void setFineId(Long fineId) {
        this.fineId = fineId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
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