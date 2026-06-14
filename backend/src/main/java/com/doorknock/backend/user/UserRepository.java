package com.doorknock.backend.user;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRole(UserRole role);

    @Query("select user from AppUser user where lower(user.email) = lower(:email) and user.emailVerified = false")
    Optional<AppUser> findPendingVerificationByEmail(@Param("email") String email);

    @Query("select user from AppUser user where user.emailVerified is null")
    List<AppUser> findLegacyUsersWithoutVerificationStatus();
}
