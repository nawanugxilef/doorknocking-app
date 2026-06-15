package com.doorknock.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.email")
public record EmailVerificationProperties(
        String from,
        String fromName,
        String frontendUrl,
        String provider,
        String brevoApiKey,
        String webhookUrl,
        String webhookSecret
) {
}
