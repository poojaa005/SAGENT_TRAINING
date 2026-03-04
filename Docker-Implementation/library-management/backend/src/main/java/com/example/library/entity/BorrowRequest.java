package com.example.library.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "borrow_request")
public class BorrowRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long request_id;

    private LocalDate request_date;

    private String status;   // PENDING, APPROVED, REJECTED

    // Many Requests -> One Member
    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // Many Requests -> One Book
    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    // Constructors
    public BorrowRequest() {
    }

    public BorrowRequest(Long request_id, LocalDate request_date, String status,
                         Member member, Book book) {
        this.request_id = request_id;
        this.request_date = request_date;
        this.status = status;
        this.member = member;
        this.book = book;
    }

    // Getters and Setters

    public Long getRequest_id() {
        return request_id;
    }

    public void setRequest_id(Long request_id) {
        this.request_id = request_id;
    }

    public LocalDate getRequest_date() {
        return request_date;
    }

    public void setRequest_date(LocalDate request_date) {
        this.request_date = request_date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }
}
