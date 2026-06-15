package com.doorknock.backend.auth;

import com.doorknock.backend.config.EmailVerificationProperties;
import com.doorknock.backend.user.AppUser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationMailService {
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final EmailVerificationProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendVerificationLink(AppUser user, String token) {
        if (isBlank(properties.from()) || isBlank(properties.frontendUrl())) {
            throw new EmailDeliveryException("Email delivery is not configured.");
        }

        String verificationUrl = buildVerificationUrl(token);

        if ("brevo".equalsIgnoreCase(properties.provider())) {
            sendWithBrevo(user, verificationUrl);
            return;
        }

        if ("google-apps-script".equalsIgnoreCase(properties.provider())) {
            sendWithAppsScript(user, verificationUrl);
            return;
        }

        throw new EmailDeliveryException("Email provider is not configured.");
    }

    private void sendWithBrevo(AppUser user, String verificationUrl) {
        if (isBlank(properties.brevoApiKey())) {
            throw new EmailDeliveryException("Brevo email delivery is not configured.");
        }

        String payload = buildBrevoPayload(user, verificationUrl);

        HttpRequest request = HttpRequest.newBuilder(URI.create(BREVO_API_URL))
                .header("accept", "application/json")
                .header("api-key", properties.brevoApiKey())
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 300) {
                throw new EmailDeliveryException("Brevo rejected verification email request: " + response.body());
            }
        } catch (IOException | InterruptedException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new EmailDeliveryException("Unable to send verification email.", exception);
        }
    }

    private void sendWithAppsScript(AppUser user, String verificationUrl) {
        if (isBlank(properties.webhookUrl()) || isBlank(properties.webhookSecret())) {
            throw new EmailDeliveryException("Google Apps Script email delivery is not configured.");
        }

        String payload = buildAppsScriptPayload(user, verificationUrl);

        HttpRequest request = HttpRequest.newBuilder(URI.create(properties.webhookUrl()))
                .header("accept", "application/json")
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 300) {
                throw new EmailDeliveryException("Apps Script rejected verification email request: " + response.body());
            }
        } catch (IOException | InterruptedException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new EmailDeliveryException("Unable to send verification email.", exception);
        }
    }

    private String buildVerificationUrl(String token) {
        String baseUrl = properties.frontendUrl().endsWith("/")
                ? properties.frontendUrl().substring(0, properties.frontendUrl().length() - 1)
                : properties.frontendUrl();
        return baseUrl + "/verify-email?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
    }

    private String buildBrevoPayload(AppUser user, String verificationUrl) {
        Map<String, Object> payload = Map.of(
                "sender", Map.of(
                        "name", defaultIfBlank(properties.fromName(), "Doorknock"),
                        "email", properties.from()
                ),
                "to", new Object[] {
                        Map.of("email", user.getEmail(), "name", user.getFullName())
                },
                "subject", "Verify your Doorknock account",
                "htmlContent", """
                        <p>Hi %s,</p>
                        <p>Thanks for signing up to Doorknock.</p>
                        <p>
                          <a href="%s" style="display:inline-block;padding:12px 18px;border-radius:9999px;background:#071d68;color:#ffffff;text-decoration:none;font-weight:600;">
                            Verify your email
                          </a>
                        </p>
                        <p>If the button does not work, open this link:</p>
                        <p><a href="%s">%s</a></p>
                        <p>If you did not create this account, you can ignore this email.</p>
                        """.formatted(user.getFullName(), verificationUrl, verificationUrl, verificationUrl)
        );

        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException exception) {
            throw new EmailDeliveryException("Unable to prepare verification email.", exception);
        }
    }

    private String buildAppsScriptPayload(AppUser user, String verificationUrl) {
        Map<String, Object> payload = Map.of(
                "secret", properties.webhookSecret(),
                "to", user.getEmail(),
                "subject", "Verify your Doorknock account",
                "html", """
                        <p>Hi %s,</p>
                        <p>Thanks for signing up to Doorknock.</p>
                        <p>
                          <a href="%s" style="display:inline-block;padding:12px 18px;border-radius:9999px;background:#071d68;color:#ffffff;text-decoration:none;font-weight:600;">
                            Verify your email
                          </a>
                        </p>
                        <p>If the button does not work, open this link:</p>
                        <p><a href="%s">%s</a></p>
                        <p>If you did not create this account, you can ignore this email.</p>
                        """.formatted(user.getFullName(), verificationUrl, verificationUrl, verificationUrl),
                "text", """
                        Hi %s,

                        Thanks for signing up to Doorknock.

                        Verify your email by opening this link:
                        %s

                        If you did not create this account, you can ignore this email.
                        """.formatted(user.getFullName(), verificationUrl),
                "fromName", defaultIfBlank(properties.fromName(), "Doorknock")
        );

        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException exception) {
            throw new EmailDeliveryException("Unable to prepare verification email.", exception);
        }
    }

    private String defaultIfBlank(String value, String fallback) {
        return isBlank(value) ? fallback : value;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
