package com.example.rescueanimal;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

    private final OwnerRepository ownerRepository;

    public AuthController(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    @GetMapping("/api/auth/status")
    public Map<String, Object> status(Authentication authentication) {
        boolean authenticated = authentication != null
                && !(authentication instanceof AnonymousAuthenticationToken)
                && authentication.isAuthenticated();

        if (!authenticated) {
            return Map.of(
                    "authenticated", false,
                    "username", "",
                    "owner_id", ""
            );
        }

        String username = authentication.getName();
        Integer ownerId = ownerRepository.findByUsername(username)
                .map(OwnerEntity::getOwner_id)
                .orElse(null);

        return Map.of(
                "authenticated", true,
                "username", username,
                "owner_id", ownerId != null ? ownerId : ""
        );
    }
}
