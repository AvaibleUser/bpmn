package edu.ss1.bpmn.domain.dto.party.chat;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder(toBuilder = true)
public record ChatDto(
        Long id,
        @JsonProperty("username") String registrationUserUsername,
        String content,
        Instant sentAt) {
}
