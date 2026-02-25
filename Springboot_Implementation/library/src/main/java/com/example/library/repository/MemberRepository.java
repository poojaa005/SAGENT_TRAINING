package com.example.library.repository;
import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.library.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // Search by exact name
    List<Member> findByName(String name);

    // Search by exact email
    List<Member> findByEmail(String email);

    // Search by name containing (partial search)
    List<Member> findByNameContaining(String name);

    // Search by email containing
    List<Member> findByEmailContaining(String email);

    // For JWT login
    Optional<Member> findOneByEmail(String email);
}