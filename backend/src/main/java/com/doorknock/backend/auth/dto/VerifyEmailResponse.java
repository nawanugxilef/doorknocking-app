package com.doorknock.backend.auth.dto;

public record VerifyEmailResponse(
        String email,
        String message
) {
}
