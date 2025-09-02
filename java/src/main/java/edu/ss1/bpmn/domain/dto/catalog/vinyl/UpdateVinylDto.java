package edu.ss1.bpmn.domain.dto.catalog.vinyl;

import lombok.Builder;

@Builder(toBuilder = true)
public record UpdateVinylDto(
        Integer size,
        String specialEdition) {
}
