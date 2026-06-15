package com.doorknock.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.doorknock.backend.auth.dto.AuthResponse;
import com.doorknock.backend.auth.dto.LoginRequest;
import com.doorknock.backend.auth.dto.RegisterRequest;
import com.doorknock.backend.auth.dto.RegisterResponse;
import com.doorknock.backend.auth.dto.VerifyEmailResponse;
import com.doorknock.backend.auth.dto.VerifyEmailRequest;
import com.doorknock.backend.security.JwtService;
import com.doorknock.backend.user.AppUser;
import com.doorknock.backend.user.UserRepository;
import com.doorknock.backend.user.UserRole;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class AuthServiceTests {
    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @Mock
    private VerificationMailService verificationMailService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                authenticationManager,
                jwtService,
                passwordEncoder,
                userRepository,
                verificationMailService
        );
        ReflectionTestUtils.setField(authService, "verificationLinkExpiryMinutes", 1440L);
        ReflectionTestUtils.setField(authService, "verificationResendCooldownSeconds", 60L);
    }

    @Test
    void registerCreatesPendingDoorknockerAndSendsVerificationLink() {
        RegisterRequest request = new RegisterRequest(
                "Alex Volunteer",
                "Alex@Example.com",
                "password123",
                "0400000000",
                "Sydney"
        );
        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any())).thenAnswer(invocation -> "hash:" + invocation.getArgument(0));
        when(userRepository.save(any(AppUser.class))).thenAnswer(invocation -> {
            AppUser user = invocation.getArgument(0);
            user.setId(10L);
            return user;
        });

        RegisterResponse response = authService.register(request);

        ArgumentCaptor<AppUser> userCaptor = ArgumentCaptor.forClass(AppUser.class);
        ArgumentCaptor<String> tokenCaptor = ArgumentCaptor.forClass(String.class);
        verify(userRepository).save(userCaptor.capture());
        verify(verificationMailService).sendVerificationLink(
                eq(userCaptor.getValue()),
                tokenCaptor.capture()
        );

        assertThat(response.email()).isEqualTo("alex@example.com");
        assertThat(response.message()).contains("Verification email sent");
        assertThat(tokenCaptor.getValue()).isNotBlank();
        assertThat(userCaptor.getValue().getRole()).isEqualTo(UserRole.DOORKNOCKER);
        assertThat(userCaptor.getValue().isEmailVerified()).isFalse();
        assertThat(userCaptor.getValue().getVerificationToken())
                .isEqualTo(tokenCaptor.getValue());
    }

    @Test
    void verifyEmailMarksUserVerified() {
        AppUser user = AppUser.builder()
                .id(10L)
                .fullName("Alex Volunteer")
                .email("alex@example.com")
                .password("hash:password123")
                .role(UserRole.DOORKNOCKER)
                .emailVerified(false)
                .verificationToken("verify-token")
                .verificationExpiresAt(Instant.now().plusSeconds(300))
                .verificationSentAt(Instant.now())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        when(userRepository.findPendingVerificationByToken("verify-token"))
                .thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        VerifyEmailResponse response = authService.verifyEmail(
                new VerifyEmailRequest("verify-token")
        );

        assertThat(response.message()).contains("Email verified");
        assertThat(user.isEmailVerified()).isTrue();
        assertThat(user.getVerificationToken()).isNull();
        assertThat(user.getVerificationExpiresAt()).isNull();
    }

    @Test
    void registerRejectsEmailAlreadyAwaitingVerification() {
        AppUser pendingUser = AppUser.builder()
                .email("alex@example.com")
                .emailVerified(false)
                .build();
        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(pendingUser));

        assertThatThrownBy(() -> authService.register(new RegisterRequest(
                "Alex Volunteer",
                "alex@example.com",
                "password123",
                "0400000000",
                "Sydney"
        )))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("awaiting verification");

        verify(userRepository, never()).save(any());
        verify(verificationMailService, never()).sendVerificationLink(any(), any());
    }

    @Test
    void loginRejectsAccountAwaitingVerification() {
        AppUser pendingUser = AppUser.builder()
                .email("alex@example.com")
                .emailVerified(false)
                .build();
        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(pendingUser));

        assertThatThrownBy(() -> authService.login(
                new LoginRequest("alex@example.com", "password123")
        ))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("verify your email");
    }

    @Test
    void resendRejectsRequestsDuringCooldown() {
        AppUser pendingUser = AppUser.builder()
                .email("alex@example.com")
                .emailVerified(false)
                .verificationSentAt(Instant.now())
                .build();
        when(userRepository.findPendingVerificationByEmail("alex@example.com"))
                .thenReturn(Optional.of(pendingUser));

        assertThatThrownBy(() -> authService.resendVerificationCode("alex@example.com"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("wait");

        verify(userRepository, never()).save(any());
        verify(verificationMailService, never()).sendVerificationLink(any(), any());
    }
}
