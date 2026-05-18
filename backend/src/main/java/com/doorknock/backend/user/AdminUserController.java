package com.doorknock.backend.user;

import com.doorknock.backend.user.dto.AdminUpdateUserRequest;
import com.doorknock.backend.user.dto.UserResponse;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VOLUNTEER_COORDINATOR')")
    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VOLUNTEER_COORDINATOR')")
    public UserResponse updateUser(
            @AuthenticationPrincipal AppUser actor,
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRequest request
    ) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String normalizedEmail = request.email().toLowerCase();
        userRepository.findByEmail(normalizedEmail)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Email is already registered");
                });

        if (actor.getRole() == UserRole.VOLUNTEER_COORDINATOR) {
            if (request.role() != user.getRole()) {
                throw new IllegalArgumentException("Coordinator cannot change user roles");
            }
            if (user.getRole() == UserRole.ADMIN) {
                throw new IllegalArgumentException("Coordinator cannot edit admin users");
            }
        }

        user.setFullName(request.fullName());
        user.setEmail(normalizedEmail);
        user.setPhoneNumber(request.phoneNumber());
        user.setAddress(request.address());
        user.setRole(request.role());
        user.setUpdatedAt(Instant.now());

        return UserResponse.from(userRepository.save(user));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@AuthenticationPrincipal AppUser actor, @PathVariable Long id) {
        if (actor.getId().equals(id)) {
            throw new IllegalArgumentException("You cannot delete your own account");
        }
        userRepository.deleteById(id);
    }
}
