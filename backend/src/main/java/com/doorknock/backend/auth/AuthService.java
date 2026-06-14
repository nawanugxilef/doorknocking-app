package com.doorknock.backend.auth;

import com.doorknock.backend.auth.dto.AuthResponse;
import com.doorknock.backend.auth.dto.LoginRequest;
import com.doorknock.backend.auth.dto.RegisterResponse;
import com.doorknock.backend.auth.dto.RegisterRequest;
import com.doorknock.backend.auth.dto.VerifyEmailRequest;
import com.doorknock.backend.security.JwtService;
import com.doorknock.backend.user.AppUser;
import com.doorknock.backend.user.UserRepository;
import com.doorknock.backend.user.dto.UserResponse;
import java.security.SecureRandom;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VerificationMailService verificationMailService;

    @Value("${app.auth.verification-code-expiry-minutes:15}")
    private long verificationCodeExpiryMinutes;

    @Value("${app.auth.verification-resend-cooldown-seconds:60}")
    private long verificationResendCooldownSeconds;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        Instant now = Instant.now();
        String email = request.email().toLowerCase();
        userRepository.findByEmail(email).ifPresent(existing -> {
            if (existing.isEmailVerified()) {
                throw new IllegalArgumentException("Email is already registered");
            }
            throw new IllegalStateException(
                    "This email is awaiting verification. Use resend code to request a new code."
            );
        });

        String verificationCode = generateVerificationCode();
        AppUser user = AppUser.builder()
                .fullName(request.fullName())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .phoneNumber(request.phoneNumber())
                .address(request.address())
                .role(request.role())
                .emailVerified(false)
                .verificationCodeHash(passwordEncoder.encode(verificationCode))
                .verificationExpiresAt(now.plusSeconds(verificationCodeExpiryMinutes * 60))
                .verificationSentAt(now)
                .createdAt(now)
                .updatedAt(now)
                .build();

        AppUser saved = userRepository.save(user);
        verificationMailService.sendVerificationCode(saved, verificationCode, verificationCodeExpiryMinutes);

        return new RegisterResponse(
                saved.getEmail(),
                "Verification code sent to your email.",
                verificationCodeExpiryMinutes
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        AppUser user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!user.isEmailVerified()) {
            throw new IllegalStateException("Please verify your email before signing in.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );

        return new AuthResponse(jwtService.generateToken(user), UserResponse.from(user));
    }

    @Transactional
    public AuthResponse verifyEmail(VerifyEmailRequest request) {
        AppUser user = userRepository.findPendingVerificationByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("No pending verification found for this email."));

        if (user.getVerificationExpiresAt() == null || Instant.now().isAfter(user.getVerificationExpiresAt())) {
            throw new IllegalArgumentException("Verification code has expired. Please request a new code.");
        }

        if (user.getVerificationCodeHash() == null
                || !passwordEncoder.matches(request.code().trim(), user.getVerificationCodeHash())) {
            throw new IllegalArgumentException("Verification code is invalid.");
        }

        user.setEmailVerified(true);
        user.setVerificationCodeHash(null);
        user.setVerificationExpiresAt(null);
        user.setVerificationSentAt(null);
        user.setUpdatedAt(Instant.now());
        AppUser saved = userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(saved), UserResponse.from(saved));
    }

    @Transactional
    public RegisterResponse resendVerificationCode(String emailAddress) {
        AppUser user = userRepository.findPendingVerificationByEmail(emailAddress.toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("No pending verification found for this email."));

        Instant now = Instant.now();
        if (user.getVerificationSentAt() != null
                && now.isBefore(user.getVerificationSentAt().plusSeconds(verificationResendCooldownSeconds))) {
            throw new IllegalStateException("Please wait before requesting another verification code.");
        }

        String verificationCode = generateVerificationCode();
        user.setVerificationCodeHash(passwordEncoder.encode(verificationCode));
        user.setVerificationExpiresAt(now.plusSeconds(verificationCodeExpiryMinutes * 60));
        user.setVerificationSentAt(now);
        user.setUpdatedAt(now);
        AppUser saved = userRepository.save(user);
        verificationMailService.sendVerificationCode(saved, verificationCode, verificationCodeExpiryMinutes);

        return new RegisterResponse(
                saved.getEmail(),
                "A new verification code has been sent.",
                verificationCodeExpiryMinutes
        );
    }

    private String generateVerificationCode() {
        return String.valueOf(SECURE_RANDOM.nextInt(900_000) + 100_000);
    }
}
