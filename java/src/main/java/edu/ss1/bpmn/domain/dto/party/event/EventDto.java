package edu.ss1.bpmn.domain.dto.party.event;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder(toBuilder = true)
public record EventDto(
        Long id,
        @JsonProperty("organizer") String organizerUsername,
        String title,
        String description,
        Instant startsAt,
        Instant createdAt,
        Instant updatedAt) {
}
