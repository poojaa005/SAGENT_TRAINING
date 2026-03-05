package com.example.collegeadmission.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.collegeadmission.entity.Document;
import com.example.collegeadmission.service.DocumentService;

@RestController
@RequestMapping("/documents")
@CrossOrigin("*")
public class DocumentController {

    @Autowired
    private DocumentService service;

    // CREATE
    @PostMapping
    public Document create(@RequestBody Document document) {
        return service.save(document);
    }

    // READ ALL
    @GetMapping
    public List<Document> getAll() {
        return service.getAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Document getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Document update(@PathVariable Integer id,
                           @RequestBody Document document) {
        return service.update(id, document);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.delete(id);
        return "Document deleted successfully";
    }
}
