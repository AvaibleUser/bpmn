package edu.ss1.bpmn.domain.dto.interactivity.user;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder(toBuilder = true)
public record UpdateUserActiveDto(
        @NotNull Boolean active) {
}
