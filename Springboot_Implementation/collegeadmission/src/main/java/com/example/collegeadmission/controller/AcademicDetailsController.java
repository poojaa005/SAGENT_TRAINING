package com.example.collegeadmission.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.collegeadmission.entity.AcademicDetails;
import com.example.collegeadmission.service.AcademicDetailsService;

@RestController
@RequestMapping("/academic-details")
@CrossOrigin("*")
public class AcademicDetailsController {

    @Autowired
    private AcademicDetailsService service;

    // CREATE
    @PostMapping
    public AcademicDetails create(@RequestBody AcademicDetails details) {
        return service.save(details);
    }

    // READ ALL
    @GetMapping
    public List<AcademicDetails> getAll() {
        return service.getAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public AcademicDetails getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public AcademicDetails update(@PathVariable Integer id,
                                  @RequestBody AcademicDetails details) {
        return service.update(id, details);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.delete(id);
        return "Academic Details deleted successfully";
    }
}
