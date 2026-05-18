package com.doorknock.backend.user.dto;

import com.doorknock.backend.user.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminUpdateUserRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        String phoneNumber,
        String address,
        @NotNull UserRole role
) {
}
