package com.example.library.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.entity.Librarian;
import com.example.library.repository.LibrarianRepository;

@Service
public class LibrarianService {

    @Autowired
    private LibrarianRepository librarianRepository;

    // Create
    public Librarian saveLibrarian(Librarian librarian) {
        return librarianRepository.save(librarian);
    }

    // Read All
    public List<Librarian> getAllLibrarians() {
        return librarianRepository.findAll();
    }

    // Read By Id
    public Optional<Librarian> getLibrarianById(Long id) {
        return librarianRepository.findById(id);
    }

    // Update
    public Librarian updateLibrarian(Long id, Librarian librarianDetails) {
        Librarian librarian = librarianRepository.findById(id).orElseThrow();

        librarian.setLibrarian_name(librarianDetails.getLibrarian_name());
        librarian.setLibrarian_email(librarianDetails.getLibrarian_email());
        librarian.setLibrarian_password(librarianDetails.getLibrarian_password());

        return librarianRepository.save(librarian);
    }

    // Delete
    public void deleteLibrarian(Long id) {
        librarianRepository.deleteById(id);
    }
}
