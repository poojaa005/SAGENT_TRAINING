package com.example.collegeadmission.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.collegeadmission.entity.Document;
import com.example.collegeadmission.repository.DocumentRepository;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository repository;

    // CREATE
    public Document save(Document document) {
        return repository.save(document);
    }

    // READ ALL
    public List<Document> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    public Document getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE
    public Document update(Integer id, Document document) {

        Document existing = repository.findById(id).orElse(null);

        if (existing != null) {
            existing.setAppId(document.getAppId());
            existing.setDocumentDate(document.getDocumentDate());
            existing.setDocumentType(document.getDocumentType());
            existing.setFilePath(document.getFilePath());

            return repository.save(existing);
        }

        return null;
    }

    // DELETE
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
