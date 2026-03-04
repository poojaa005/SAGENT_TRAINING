package com.example.library.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.library.entity.Member;
import com.example.library.service.MemberService;

import java.util.List;

@RestController
@RequestMapping("/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    // Search by name
    @GetMapping("/search/name")
    public List<Member> searchByName(@RequestParam String name) {
        return memberService.searchByName(name);
    }

    // Search by email
    @GetMapping("/search/email")
    public List<Member> searchByEmail(@RequestParam String email) {
        return memberService.searchByEmail(email);
    }

    // CREATE
    @PostMapping
    public Member createMember(@RequestBody Member member) {
        return memberService.createMember(member);
    }

    // READ ALL
    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Member getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Member updateMember(@PathVariable Long id, @RequestBody Member member) {
        return memberService.updateMember(id, member);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteMember(@PathVariable Long id) {
        return memberService.deleteMember(id);
    }
}
