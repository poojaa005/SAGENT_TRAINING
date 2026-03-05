    package com.example.collegeadmission.controller;

    import com.example.collegeadmission.entity.Officer;
    import com.example.collegeadmission.service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

    @RestController
    @RequestMapping("/officers")
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

    @GetMapping("/email/{gmail}")
    public ResponseEntity<Officer> getOfficerByEmail(@PathVariable String gmail) {
        return officerService.getOfficerByGmail(gmail)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginOfficer(@RequestBody Officer loginRequest) {
        Optional<Officer> officer = officerService.loginOfficer(
                loginRequest.getOfficerGmail(),
                loginRequest.getOfficerPassword()
        );

        if (officer.isPresent()) {
            return ResponseEntity.ok(officer.get());
        }

        Map<String, String> error = new HashMap<>();
        error.put("message", "Invalid officer gmail or password");
        return ResponseEntity.status(401).body(error);
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

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
