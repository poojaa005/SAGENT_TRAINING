package com.example.collegeadmission.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.collegeadmission.entity.Application;
import com.example.collegeadmission.service.ApplicationService;

@RestController
@RequestMapping("/applications")
@CrossOrigin("*")
public class ApplicationController {

    @Autowired
    private ApplicationService service;

    // CREATE
    @PostMapping
    public Application create(@RequestBody Application application) {
        return service.save(application);
    }

    // READ ALL
    @GetMapping
    public List<Application> getAll() {
        return service.getAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Application getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Application update(@PathVariable Integer id,
                              @RequestBody Application application) {
        return service.update(id, application);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.delete(id);
        return "Application deleted successfully";
    }
}
