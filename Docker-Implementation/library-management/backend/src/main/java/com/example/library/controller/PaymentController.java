package com.example.library.controller;

import com.example.library.entity.Payment;
import com.example.library.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // 🔹 PAY FINE
    @PostMapping("/pay/{fineId}")
    public Payment payFine(@PathVariable Long fineId,
                           @RequestParam String method) {
        return paymentService.payFine(fineId, method);
    }

    // 🔹 GET ALL PAYMENTS
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    // 🔹 GET PAYMENT BY ID
    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id);
    }

    // 🔹 DELETE PAYMENT
    @DeleteMapping("/{id}")
    public String deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return "Payment deleted successfully";
    }
}