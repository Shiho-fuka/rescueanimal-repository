package com.example.rescueanimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initOwnersData(OwnerRepository ownerRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (ownerRepository.count() == 0) {
                ownerRepository.save(new OwnerEntity(101, "user101", passwordEncoder.encode("password")));
                ownerRepository.save(new OwnerEntity(102, "user102", passwordEncoder.encode("password")));
                ownerRepository.save(new OwnerEntity(103, "user103", passwordEncoder.encode("password")));
            }
        };
    }
}
