package com.example.library.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.library.entity.BorrowRequest;
import com.example.library.service.BorrowRequestService;

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin("*")
public class BorrowRequestController {

    @Autowired
    private BorrowRequestService borrowRequestService;

    // Create Request
    @PostMapping("/{memberId}/{bookId}")
    public BorrowRequest createRequest(@PathVariable Long memberId,
                                       @PathVariable Long bookId) {
        return borrowRequestService.createRequest(memberId, bookId);
    }

    // Get All Requests
    @GetMapping
    public List<BorrowRequest> getAllRequests() {
        return borrowRequestService.getAllRequests();
    }

    // Update Status
    @PutMapping("/{requestId}/{status}")
    public BorrowRequest updateStatus(@PathVariable Long requestId,
                                      @PathVariable String status) {
        return borrowRequestService.updateStatus(requestId, status);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteRequest(@PathVariable Long id) {
        borrowRequestService.deleteRequest(id);
        return "Request deleted successfully";
    }
}
