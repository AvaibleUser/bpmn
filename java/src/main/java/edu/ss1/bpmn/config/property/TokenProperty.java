package edu.ss1.bpmn.config.property;

import java.time.temporal.ChronoUnit;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("security.token")
public record TokenProperty(
        Long expirationTime,
        ChronoUnit timeUnit) {
}
