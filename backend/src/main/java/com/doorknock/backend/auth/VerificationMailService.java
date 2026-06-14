package com.doorknock.backend.auth;

import com.doorknock.backend.config.MailProperties;
import com.doorknock.backend.user.AppUser;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationMailService {
    private final JavaMailSender mailSender;
    private final MailProperties mailProperties;

    public void sendVerificationCode(AppUser user, String code, long expiresInMinutes) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setFrom(mailProperties.from());
        message.setSubject("Verify your Doorknock account");
        message.setText("""
                Hi %s,

                Your Doorknock verification code is: %s

                It expires in %d minutes.

                If you did not create this account, please ignore this email.
                """.formatted(user.getFullName(), code, expiresInMinutes));

        mailSender.send(message);
    }
}
