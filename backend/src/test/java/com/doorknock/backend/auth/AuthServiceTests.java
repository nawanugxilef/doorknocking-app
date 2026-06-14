package com.doorknock.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.doorknock.backend.auth.dto.AuthResponse;
import com.doorknock.backend.auth.dto.LoginRequest;
import com.doorknock.backend.auth.dto.RegisterRequest;
import com.doorknock.backend.auth.dto.RegisterResponse;
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
        ReflectionTestUtils.setField(authService, "verificationCodeExpiryMinutes", 15L);
        ReflectionTestUtils.setField(authService, "verificationResendCooldownSeconds", 60L);
    }

    @Test
    void registerCreatesPendingDoorknockerAndSendsSixDigitCode() {
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
        ArgumentCaptor<String> codeCaptor = ArgumentCaptor.forClass(String.class);
        verify(userRepository).save(userCaptor.capture());
        verify(verificationMailService).sendVerificationCode(
                eq(userCaptor.getValue()),
                codeCaptor.capture(),
                eq(15L)
        );

        assertThat(response.email()).isEqualTo("alex@example.com");
        assertThat(codeCaptor.getValue()).matches("\\d{6}");
        assertThat(userCaptor.getValue().getRole()).isEqualTo(UserRole.DOORKNOCKER);
        assertThat(userCaptor.getValue().isEmailVerified()).isFalse();
        assertThat(userCaptor.getValue().getVerificationCodeHash())
                .isEqualTo("hash:" + codeCaptor.getValue());
    }

    @Test
    void verifyEmailMarksUserVerifiedAndReturnsSession() {
        AppUser user = AppUser.builder()
                .id(10L)
                .fullName("Alex Volunteer")
                .email("alex@example.com")
                .password("hash:password123")
                .role(UserRole.DOORKNOCKER)
                .emailVerified(false)
                .verificationCodeHash("hash:123456")
                .verificationExpiresAt(Instant.now().plusSeconds(300))
                .verificationSentAt(Instant.now())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        when(userRepository.findPendingVerificationByEmail("alex@example.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", "hash:123456")).thenReturn(true);
        when(userRepository.save(user)).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        AuthResponse response = authService.verifyEmail(
                new VerifyEmailRequest("alex@example.com", "123456")
        );

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(user.isEmailVerified()).isTrue();
        assertThat(user.getVerificationCodeHash()).isNull();
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
        verify(verificationMailService, never()).sendVerificationCode(any(), any(), anyLong());
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
        verify(verificationMailService, never()).sendVerificationCode(any(), any(), anyLong());
    }
}
