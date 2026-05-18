package com.doorknock.backend.auth.dto;

import com.doorknock.backend.user.dto.UserResponse;

public record AuthResponse(String token, UserResponse user) {
}
