package com.example.collegeadmission.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.collegeadmission.entity.Payment;
import com.example.collegeadmission.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository repository;

    // CREATE
    public Payment save(Payment payment) {
        return repository.save(payment);
    }

    // READ ALL
    public List<Payment> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    public Payment getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE
    public Payment update(Integer id, Payment payment) {

        Payment existing = repository.findById(id).orElse(null);

        if (existing != null) {
            existing.setAppId(payment.getAppId());
            existing.setAmount(payment.getAmount());
            existing.setPaymentMethod(payment.getPaymentMethod());
            existing.setPaymentStatus(payment.getPaymentStatus());
            existing.setPaymentDate(payment.getPaymentDate());

            return repository.save(existing);
        }

        return null;
    }

    // DELETE
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
