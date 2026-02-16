package com.example.library.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "book")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long book_id;

    @Column(nullable = false)
    private String book_title;

    @Column(nullable = false)
    private String book_author;

    @Column(nullable = false)
    private String book_category;

    @Column(nullable = false)
    private Integer book_quantity;

    // Constructors
    public Book() {
    }

    public Book(Long book_id, String book_title, String book_author,
                String book_category, Integer book_quantity) {
        this.book_id = book_id;
        this.book_title = book_title;
        this.book_author = book_author;
        this.book_category = book_category;
        this.book_quantity = book_quantity;
    }

    // Getters and Setters

    public Long getBook_id() {
        return book_id;
    }

    public void setBook_id(Long book_id) {
        this.book_id = book_id;
    }

    public String getBook_title() {
        return book_title;
    }

    public void setBook_title(String book_title) {
        this.book_title = book_title;
    }

    public String getBook_author() {
        return book_author;
    }

    public void setBook_author(String book_author) {
        this.book_author = book_author;
    }

    public String getBook_category() {
        return book_category;
    }

    public void setBook_category(String book_category) {
        this.book_category = book_category;
    }

    public Integer getBook_quantity() {
        return book_quantity;
    }

    public void setBook_quantity(Integer book_quantity) {
        this.book_quantity = book_quantity;
    }
}
