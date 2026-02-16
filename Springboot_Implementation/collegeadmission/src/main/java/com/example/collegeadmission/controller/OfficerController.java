package com.example.collegeadmission.controller;

import com.example.collegeadmission.entity.Officer;
import com.example.collegeadmission.service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/officers")
@CrossOrigin("*")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    // CREATE
    @PostMapping
    public Officer createOfficer(@RequestBody Officer officer) {
        return officerService.saveOfficer(officer);
    }

    // READ ALL
    @GetMapping
    public List<Officer> getAllOfficers() {
        return officerService.getAllOfficers();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Optional<Officer> getOfficerById(@PathVariable Long id) {
        return officerService.getOfficerById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Officer updateOfficer(@PathVariable Long id, @RequestBody Officer officer) {
        return officerService.updateOfficer(id, officer);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteOfficer(@PathVariable Long id) {
        officerService.deleteOfficer(id);
        return "Officer deleted successfully!";
    }
}
