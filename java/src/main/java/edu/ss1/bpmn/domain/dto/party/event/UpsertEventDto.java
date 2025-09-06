package edu.ss1.bpmn.domain.dto.party.event;

import java.time.Instant;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder(toBuilder = true)
public record UpsertEventDto(
        @NotBlank String title,
        @NotBlank String description,
        @NotNull @Future Instant startsAt) {
}
