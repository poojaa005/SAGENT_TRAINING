package com.example.groceryapp.service;

import com.example.groceryapp.entity.Payment;
import com.example.groceryapp.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // Create
    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    // Get All
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Get by Payment ID
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    // Get by Order ID
    public List<Payment> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrder_OrderId(orderId);
    }

    // Update
    public Payment updatePayment(Long id, Payment paymentDetails) {
        Payment payment = paymentRepository.findById(id).orElseThrow();
        payment.setAmount(paymentDetails.getAmount());
        payment.setPaymentMethod(paymentDetails.getPaymentMethod());
        payment.setPaymentStatus(paymentDetails.getPaymentStatus());
        return paymentRepository.save(payment);
    }

    // Delete
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}