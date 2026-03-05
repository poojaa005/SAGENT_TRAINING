package com.example.budgettracker.config;

import com.example.budgettracker.entity.User;
import com.example.budgettracker.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DefaultUserSeeder {

    @Bean
    CommandLineRunner seedDefaultUser(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = new User();
                user.setName("Demo User");
                user.setEmail("test@test.com");
                user.setPassword("test123");
                userRepository.save(user);
            }
        };
    }
}
