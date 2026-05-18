package com.doorknock.backend.config;

import com.doorknock.backend.user.AppUser;
import com.doorknock.backend.user.UserRepository;
import com.doorknock.backend.user.UserRole;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@EnableConfigurationProperties(AdminBootstrapProperties.class)
public class AdminBootstrapRunner implements CommandLineRunner {
    private final AdminBootstrapProperties properties;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (!properties.enabled() || userRepository.existsByRole(UserRole.ADMIN)) {
            return;
        }

        Instant now = Instant.now();
        userRepository.save(AppUser.builder()
                .fullName(properties.fullName())
                .email(properties.email().toLowerCase())
                .password(passwordEncoder.encode(properties.password()))
                .role(UserRole.ADMIN)
                .createdAt(now)
                .updatedAt(now)
                .build());
    }
}
