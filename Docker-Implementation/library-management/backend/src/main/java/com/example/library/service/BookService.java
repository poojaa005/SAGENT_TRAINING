package com.example.library.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.entity.Book;
import com.example.library.repository.BookRepository;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // Create
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    // Read All
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Read By Id
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    // Update
    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id).orElseThrow();

        book.setBook_title(bookDetails.getBook_title());
        book.setBook_author(bookDetails.getBook_author());
        book.setBook_category(bookDetails.getBook_category());
        book.setBook_quantity(bookDetails.getBook_quantity());

        return bookRepository.save(book);
    }

    // Delete
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
