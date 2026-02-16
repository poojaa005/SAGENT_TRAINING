package com.example.library.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.entity.BorrowRequest;
import com.example.library.entity.Fine;
import com.example.library.repository.BorrowRequestRepository;
import com.example.library.repository.FineRepository;

@Service
public class FineService {

    @Autowired
    private FineRepository fineRepository;

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

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
        fine.setDue_date(dueDate);
        fine.setReturn_date(returnDate);
        fine.setAmount(amount);

        return fineRepository.save(fine);
    }

    // Get All Fines
    public List<Fine> getAllFines() {
        return fineRepository.findAll();
    }

    // Delete Fine
    public void deleteFine(Long id) {
        fineRepository.deleteById(id);
    }
}
