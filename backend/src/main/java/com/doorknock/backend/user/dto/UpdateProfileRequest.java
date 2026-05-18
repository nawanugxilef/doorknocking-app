package com.doorknock.backend.user.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank String fullName,
        String phoneNumber,
        String address
) {
}
