package api_gateway.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@ConfigurationProperties(prefix = "acme.auth")
public record AuthProperties(String jwtSecret, Duration tokenTtl, String adminPassword, String viewerPassword) {
}
