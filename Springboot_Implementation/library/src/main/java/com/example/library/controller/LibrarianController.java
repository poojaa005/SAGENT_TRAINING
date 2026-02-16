package com.example.library.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.library.entity.Librarian;
import com.example.library.service.LibrarianService;

@RestController
@RequestMapping("/api/librarians")
@CrossOrigin("*")
public class LibrarianController {

    @Autowired
    private LibrarianService librarianService;

    // Create
    @PostMapping
    public Librarian createLibrarian(@RequestBody Librarian librarian) {
        return librarianService.saveLibrarian(librarian);
    }

    // Read All
    @GetMapping
    public List<Librarian> getAllLibrarians() {
        return librarianService.getAllLibrarians();
    }

    // Read By Id
    @GetMapping("/{id}")
    public Librarian getLibrarianById(@PathVariable Long id) {
        return librarianService.getLibrarianById(id).orElseThrow();
    }

    // Update
    @PutMapping("/{id}")
    public Librarian updateLibrarian(@PathVariable Long id,
                                     @RequestBody Librarian librarian) {
        return librarianService.updateLibrarian(id, librarian);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteLibrarian(@PathVariable Long id) {
        librarianService.deleteLibrarian(id);
        return "Librarian deleted successfully!";
    }
}
