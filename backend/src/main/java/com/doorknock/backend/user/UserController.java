package com.doorknock.backend.user;

import com.doorknock.backend.user.dto.UpdateProfileRequest;
import com.doorknock.backend.user.dto.UserResponse;
import jakarta.validation.Valid;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal AppUser user) {
        return UserResponse.from(user);
    }

    @PutMapping("/me")
    public UserResponse updateMe(
            @AuthenticationPrincipal AppUser user,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        user.setFullName(request.fullName());
        user.setPhoneNumber(request.phoneNumber());
        user.setAddress(request.address());
        user.setUpdatedAt(Instant.now());
        return UserResponse.from(userRepository.save(user));
    }
}
