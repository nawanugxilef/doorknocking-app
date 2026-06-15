package com.doorknock.backend.auth;

import com.doorknock.backend.auth.dto.AuthResponse;
import com.doorknock.backend.auth.dto.LoginRequest;
import com.doorknock.backend.auth.dto.RegisterResponse;
import com.doorknock.backend.auth.dto.RegisterRequest;
import com.doorknock.backend.auth.dto.VerifyEmailResponse;
import com.doorknock.backend.auth.dto.VerifyEmailRequest;
import com.doorknock.backend.security.JwtService;
import com.doorknock.backend.user.AppUser;
import com.doorknock.backend.user.UserRepository;
import com.doorknock.backend.user.dto.UserResponse;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
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

    @Value("${app.auth.verification-link-expiry-minutes:1440}")
    private long verificationLinkExpiryMinutes;

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
                    "This email is awaiting verification. Use resend verification to request a new email."
            );
        });

        String verificationToken = generateVerificationToken();
        AppUser user = AppUser.builder()
                .fullName(request.fullName())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .phoneNumber(request.phoneNumber())
                .address(request.address())
                .role(request.role())
                .emailVerified(false)
                .verificationToken(verificationToken)
                .verificationExpiresAt(now.plusSeconds(verificationLinkExpiryMinutes * 60))
                .verificationSentAt(now)
                .createdAt(now)
                .updatedAt(now)
                .build();

        AppUser saved = userRepository.save(user);
        verificationMailService.sendVerificationLink(saved, verificationToken);

        return new RegisterResponse(
                saved.getEmail(),
                "Verification email sent. Open the link in your inbox to activate your account."
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
    public VerifyEmailResponse verifyEmail(VerifyEmailRequest request) {
        AppUser user = userRepository.findPendingVerificationByToken(request.token())
                .orElseThrow(() -> new IllegalArgumentException("Verification link is invalid."));

        if (user.getVerificationExpiresAt() == null || Instant.now().isAfter(user.getVerificationExpiresAt())) {
            throw new IllegalArgumentException("Verification link has expired. Please request a new verification email.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationExpiresAt(null);
        user.setVerificationSentAt(null);
        user.setUpdatedAt(Instant.now());
        AppUser saved = userRepository.save(user);
        return new VerifyEmailResponse(saved.getEmail(), "Email verified. You can now sign in.");
    }

    @Transactional
    public RegisterResponse resendVerificationCode(String emailAddress) {
        AppUser user = userRepository.findPendingVerificationByEmail(emailAddress.toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("No pending verification found for this email."));

        Instant now = Instant.now();
        if (user.getVerificationSentAt() != null
                && now.isBefore(user.getVerificationSentAt().plusSeconds(verificationResendCooldownSeconds))) {
            throw new IllegalStateException("Please wait before requesting another verification email.");
        }

        String verificationToken = generateVerificationToken();
        user.setVerificationToken(verificationToken);
        user.setVerificationExpiresAt(now.plusSeconds(verificationLinkExpiryMinutes * 60));
        user.setVerificationSentAt(now);
        user.setUpdatedAt(now);
        AppUser saved = userRepository.save(user);
        verificationMailService.sendVerificationLink(saved, verificationToken);

        return new RegisterResponse(
                saved.getEmail(),
                "A new verification email has been sent."
        );
    }

    private String generateVerificationToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
