package edu.ss1.bpmn.domain.dto.party.registration;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder(toBuilder = true)
public record RegistrationDto(
        Long id,
        String eventTitle,
        @JsonProperty("username") String userUsername,
        Instant registeredAt,
        Instant updatedAt) {
}
