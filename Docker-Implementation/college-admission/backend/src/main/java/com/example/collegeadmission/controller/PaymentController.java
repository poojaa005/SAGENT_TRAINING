package com.example.collegeadmission.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.collegeadmission.entity.Payment;
import com.example.collegeadmission.service.PaymentService;

@RestController
@RequestMapping("/payments")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentService service;

    // CREATE
    @PostMapping
    public Payment create(@RequestBody Payment payment) {
        return service.save(payment);
    }

    // READ ALL
    @GetMapping
    public List<Payment> getAll() {
        return service.getAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Payment getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Payment update(@PathVariable Integer id,
                          @RequestBody Payment payment) {
        return service.update(id, payment);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.delete(id);
        return "Payment deleted successfully";
    }
}
