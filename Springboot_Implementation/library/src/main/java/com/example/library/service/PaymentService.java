package com.example.library.service;

import com.example.library.entity.Fine;
import com.example.library.entity.Payment;
import com.example.library.repository.FineRepository;
import com.example.library.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private FineRepository fineRepository;

    // 🔹 CREATE / PAY FINE
    public Payment payFine(Long fineId, String method) {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fine not found"));

        if (method == null || method.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment method is required");
        }

        if (fine.getAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No pending fine");
        }

        Payment payment = new Payment();
        payment.setFine(fine);
        payment.setAmountPaid(fine.getAmount());
        payment.setPaymentMethod(method);
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentStatus("PAID");

        // Reset fine amount
        fine.setAmount(0.0);
        fineRepository.save(fine);

        return paymentRepository.save(payment);
    }

    // 🔹 READ ALL
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // 🔹 READ BY ID
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
    }

    // 🔹 DELETE
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
