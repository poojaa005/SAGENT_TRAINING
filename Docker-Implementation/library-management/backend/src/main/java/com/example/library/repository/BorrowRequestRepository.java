package com.example.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.library.entity.BorrowRequest;

public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {

}
