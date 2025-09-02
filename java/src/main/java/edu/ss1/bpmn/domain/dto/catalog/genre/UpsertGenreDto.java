package edu.ss1.bpmn.domain.dto.catalog.genre;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder(toBuilder = true)
public record UpsertGenreDto(
        @NotBlank String name) {
}
