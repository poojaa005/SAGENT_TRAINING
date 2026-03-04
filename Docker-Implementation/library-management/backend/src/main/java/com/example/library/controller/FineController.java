package com.example.library.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.library.entity.Fine;
import com.example.library.service.FineService;

@RestController
@RequestMapping("/api/fine")
@CrossOrigin("*")
public class FineController {

    @Autowired
    private FineService fineService;

    // Calculate Fine
    @PostMapping("/{requestId}/{returnDate}")
    public Fine calculateFine(@PathVariable Long requestId,
                              @PathVariable String returnDate) {

        LocalDate date = LocalDate.parse(returnDate);
        return fineService.calculateFine(requestId, date);
    }

    // Get All Fines
    @GetMapping
    public List<Fine> getAllFines() {
        return fineService.getAllFines();
    }

    // Delete Fine
    @DeleteMapping("/{id}")
    public String deleteFine(@PathVariable Long id) {
        fineService.deleteFine(id);
        return "Fine deleted successfully";
    }
}
