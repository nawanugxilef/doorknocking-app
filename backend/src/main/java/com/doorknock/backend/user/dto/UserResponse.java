package com.doorknock.backend.user.dto;

import com.doorknock.backend.user.AppUser;
import com.doorknock.backend.user.UserRole;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        String phoneNumber,
        String address,
        UserRole role
) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getRole()
        );
    }
}
