package com.doorknock.backend.config;

import com.doorknock.backend.user.AppUser;
import com.doorknock.backend.user.UserRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LegacyUserVerificationRunner implements CommandLineRunner {
    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        if (!hasVerificationColumns()) {
            return;
        }

        List<AppUser> legacyUsers = userRepository.findLegacyUsersWithoutVerificationStatus();
        if (legacyUsers.isEmpty()) {
            return;
        }

        Instant now = Instant.now();
        legacyUsers.forEach(user -> {
            user.setEmailVerified(true);
            user.setUpdatedAt(now);
        });
        userRepository.saveAll(legacyUsers);
    }

    private boolean hasVerificationColumns() {
        Integer count = jdbcTemplate.queryForObject("""
                select count(*)
                from information_schema.columns
                where table_name = 'app_users'
                  and column_name in ('email_verified', 'verification_code_hash')
                """, Integer.class);
        return count != null && count == 2;
    }
}
