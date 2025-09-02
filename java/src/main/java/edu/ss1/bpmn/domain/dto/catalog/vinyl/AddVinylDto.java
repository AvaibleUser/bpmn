package edu.ss1.bpmn.domain.dto.catalog.vinyl;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder(toBuilder = true)
public record AddVinylDto(
        @NotNull @Positive Integer size,
        String specialEdition) {
}
