package com.example.collegeadmission.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.collegeadmission.entity.PersonalDetails;
import com.example.collegeadmission.service.PersonalDetailsService;

@RestController
@RequestMapping("/personal-details")
@CrossOrigin("*")
public class PersonalDetailsController {

    @Autowired
    private PersonalDetailsService service;

    // CREATE
    @PostMapping
    public PersonalDetails create(@RequestBody PersonalDetails details) {
        return service.save(details);
    }

    // READ ALL
    @GetMapping
    public List<PersonalDetails> getAll() {
        return service.getAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public PersonalDetails getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public PersonalDetails update(@PathVariable Integer id,
                                  @RequestBody PersonalDetails details) {
        return service.update(id, details);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.delete(id);
        return "Personal Details deleted successfully";
    }
}
