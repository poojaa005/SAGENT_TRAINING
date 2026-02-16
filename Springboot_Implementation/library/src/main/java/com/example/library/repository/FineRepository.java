package com.example.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.library.entity.Fine;

public interface FineRepository extends JpaRepository<Fine, Long> {

}
