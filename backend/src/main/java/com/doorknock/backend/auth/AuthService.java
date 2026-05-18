package com.doorknock.backend.auth;

import com.doorknock.backend.auth.dto.AuthResponse;
import com.doorknock.backend.auth.dto.LoginRequest;
import com.doorknock.backend.auth.dto.RegisterRequest;
import com.doorknock.backend.security.JwtService;
import com.doorknock.backend.user.AppUser;
import com.doorknock.backend.user.UserRepository;
import com.doorknock.backend.user.dto.UserResponse;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        Instant now = Instant.now();
        AppUser user = AppUser.builder()
                .fullName(request.fullName())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .phoneNumber(request.phoneNumber())
                .address(request.address())
                .role(request.role())
                .createdAt(now)
                .updatedAt(now)
                .build();

        AppUser saved = userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(saved), UserResponse.from(saved));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );

        AppUser user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        return new AuthResponse(jwtService.generateToken(user), UserResponse.from(user));
    }
}
