package com.example.library.controller;

import com.example.library.config.JwtUtil;
import com.example.library.entity.AuthRequest;
import com.example.library.entity.AuthResponse;
import com.example.library.entity.Librarian;
import com.example.library.entity.Member;
import com.example.library.repository.LibrarianRepository;
import com.example.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private LibrarianRepository librarianRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        // Check Member
        Optional<Member> memberOpt = memberRepository.findOneByEmail(request.getEmail());
        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            if (member.getPassword().equals(request.getPassword())) {
                String token = jwtUtil.generateToken(member.getEmail(), "MEMBER");
                return ResponseEntity.ok(new AuthResponse(
                        token, "MEMBER", member.getMemberId(),
                        member.getName(), member.getEmail()
                ));
            }
        }

        // Check Librarian
        Optional<Librarian> librarianOpt = librarianRepository.findByLibrarianEmail(request.getEmail());
        if (librarianOpt.isPresent()) {
            Librarian librarian = librarianOpt.get();
            if (librarian.getLibrarian_password().equals(request.getPassword())) {
                String token = jwtUtil.generateToken(librarian.getLibrarian_email(), "LIBRARIAN");
                return ResponseEntity.ok(new AuthResponse(
                        token, "LIBRARIAN", librarian.getLibrarian_id(),
                        librarian.getLibrarian_name(), librarian.getLibrarian_email()
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
    }
}