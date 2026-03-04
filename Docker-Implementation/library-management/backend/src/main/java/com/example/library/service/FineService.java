package com.example.library.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.library.entity.BorrowRequest;
import com.example.library.entity.Fine;
import com.example.library.repository.BorrowRequestRepository;
import com.example.library.repository.FineRepository;
import com.example.library.repository.PaymentRepository;

@Service
public class FineService {

    @Autowired
    private FineRepository fineRepository;

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    private final double FINE_PER_DAY = 10.0; // ₹10 per day

    // Create Fine when book returned
    public Fine calculateFine(Long requestId, LocalDate returnDate) {

        BorrowRequest request = borrowRequestRepository.findById(requestId).orElseThrow();

        LocalDate dueDate = request.getRequest_date().plusDays(7); // 7 days borrow period

        double amount = 0.0;

        if (returnDate.isAfter(dueDate)) {
            long daysLate = ChronoUnit.DAYS.between(dueDate, returnDate);
            amount = daysLate * FINE_PER_DAY;
        }

        Fine fine = new Fine();
        fine.setBorrowRequest(request);
        fine.setDueDate(dueDate);
        fine.setReturnDate(returnDate);
        fine.setAmount(amount);

        return fineRepository.save(fine);
    }

    // Get All Fines
    public List<Fine> getAllFines() {
        return fineRepository.findAll();
    }

    // Delete Fine
    @Transactional
    public void deleteFine(Long id) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fine not found"));

        // Payment rows reference fine_id. Delete them first to avoid FK constraint failures.
        var linkedPayments = paymentRepository.findByFine_FineId(id);
        if (!linkedPayments.isEmpty()) {
            paymentRepository.deleteAll(linkedPayments);
        }

        fineRepository.delete(fine);
    }
}
