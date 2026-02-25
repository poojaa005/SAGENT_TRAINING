package com.example.library.repository;

import com.example.library.entity.Librarian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface LibrarianRepository extends JpaRepository<Librarian, Long> {

    @Query("SELECT l FROM Librarian l WHERE l.librarian_email = :email")
    Optional<Librarian> findByLibrarianEmail(@Param("email") String email);

}