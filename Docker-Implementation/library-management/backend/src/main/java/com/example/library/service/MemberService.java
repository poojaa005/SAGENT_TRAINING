package com.example.library.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.library.entity.Member;
import com.example.library.repository.MemberRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public List<Member> searchByName(String name) {
        return memberRepository.findByNameContaining(name);
    }

    public List<Member> searchByEmail(String email) {
        return memberRepository.findByEmailContaining(email);
    }


    // CREATE
    public Member createMember(Member member) {
        return memberRepository.save(member);
    }

    // READ ALL
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // READ BY ID
    public Member getMemberById(Long id) {
        Optional<Member> optionalMember = memberRepository.findById(id);
        return optionalMember.orElse(null);
    }

    // UPDATE
    public Member updateMember(Long id, Member memberDetails) {
        Optional<Member> optionalMember = memberRepository.findById(id);

        if (optionalMember.isPresent()) {
            Member existingMember = optionalMember.get();

            existingMember.setName(memberDetails.getName());
            existingMember.setEmail(memberDetails.getEmail());
            existingMember.setPassword(memberDetails.getPassword());

            return memberRepository.save(existingMember);
        } else {
            return null;
        }
    }

    // DELETE
    public String deleteMember(Long id) {
        if (memberRepository.existsById(id)) {
            memberRepository.deleteById(id);
            return "Member deleted successfully";
        } else {
            return "Member not found";
        }
    }
}
