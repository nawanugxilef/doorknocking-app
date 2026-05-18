package com.doorknock.backend.auth.dto;

import com.doorknock.backend.user.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @Size(min = 8) String password,
        String phoneNumber,
        String address
) {
    public UserRole role() {
        return UserRole.DOORKNOCKER;
    }
}
