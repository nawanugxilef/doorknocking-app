package com.doorknock.backend.auth.dto;

public record RegisterResponse(
        String email,
        String message,
        long expiresInMinutes
) {
}
