package edu.ss1.bpmn.domain.dto.catalog.vinyl;

import lombok.Builder;

@Builder(toBuilder = true)
public record VinylDto(
        Long discographyId,
        Integer size,
        String specialEdition) {
}
