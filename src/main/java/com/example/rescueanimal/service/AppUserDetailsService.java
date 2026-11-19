package com.example.rescueanimal.service;

import com.example.rescueanimal.entity.OwnerEntity;
import com.example.rescueanimal.repository.OwnerRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final OwnerRepository ownerRepository;

    public AppUserDetailsService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        OwnerEntity owner = ownerRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username + " が見つかりません"));

        return User.withUsername(owner.getUsername())
                .password(owner.getPassword())
                .authorities("ROLE_USER")
                .build();
    }
}
