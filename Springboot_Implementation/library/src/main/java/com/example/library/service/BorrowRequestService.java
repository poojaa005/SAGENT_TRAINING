package com.example.library.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.entity.Book;
import com.example.library.entity.BorrowRequest;
import com.example.library.entity.Member;
import com.example.library.repository.BookRepository;
import com.example.library.repository.BorrowRequestRepository;
import com.example.library.repository.MemberRepository;

@Service
public class BorrowRequestService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BookRepository bookRepository;

    // Create Borrow Request
    public BorrowRequest createRequest(Long memberId, Long bookId) {

        Member member = memberRepository.findById(memberId).orElseThrow();
        Book book = bookRepository.findById(bookId).orElseThrow();

        BorrowRequest request = new BorrowRequest();
        request.setMember(member);
        request.setBook(book);
        request.setRequest_date(LocalDate.now());
        request.setStatus("PENDING");

        return borrowRequestRepository.save(request);
    }

    // Get All
    public List<BorrowRequest> getAllRequests() {
        return borrowRequestRepository.findAll();
    }

    // Update Status
    public BorrowRequest updateStatus(Long requestId, String status) {
        BorrowRequest request = borrowRequestRepository.findById(requestId).orElseThrow();
        request.setStatus(status);
        return borrowRequestRepository.save(request);
    }

    // Delete
    public void deleteRequest(Long id) {
        borrowRequestRepository.deleteById(id);
    }
}
