package com.example.library.controller;

import com.example.library.config.JwtUtil;
import com.example.library.entity.AuthRequest;
import com.example.library.entity.AuthResponse;
import com.example.library.entity.Librarian;
import com.example.library.entity.Member;
import com.example.library.repository.LibrarianRepository;
import com.example.library.repository.MemberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private LibrarianRepository librarianRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Member request) {
        String name = request.getName() == null ? "" : request.getName().trim();
        String email = request.getEmail() == null ? "" : request.getEmail().trim();
        String password = request.getPassword() == null ? "" : request.getPassword().trim();

        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Name, email and password are required");
        }

        if (memberRepository.findOneByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Member already exists with this email");
        }

        if (librarianRepository.findByLibrarianEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already used by librarian account");
        }

        Member member = new Member();
        member.setName(name);
        member.setEmail(email);
        member.setPassword(password);
        Member saved = memberRepository.save(member);

        String token = jwtUtil.generateToken(saved.getEmail(), "MEMBER");
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(
                token, "MEMBER", saved.getMemberId(), saved.getName(), saved.getEmail()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim();
        String password = request.getPassword() == null ? "" : request.getPassword().trim();

        if (email.isEmpty() || password.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email and password are required");
        }

        // Check Member
        Optional<Member> memberOpt = memberRepository.findOneByEmail(email);
        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            if (member.getPassword().equals(password)) {
                String token = jwtUtil.generateToken(member.getEmail(), "MEMBER");
                log.info("Generated JWT for member: {}", token);
                return ResponseEntity.ok(new AuthResponse(
                        token, "MEMBER", member.getMemberId(),
                        member.getName(), member.getEmail()
                ));
            }
        }

        // Check Librarian
        Optional<Librarian> librarianOpt = librarianRepository.findByLibrarianEmail(email);
        if (librarianOpt.isPresent()) {
            Librarian librarian = librarianOpt.get();
            if (librarian.getLibrarian_password().equals(password)) {
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
