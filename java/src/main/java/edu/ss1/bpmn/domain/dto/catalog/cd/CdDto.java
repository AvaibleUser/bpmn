package edu.ss1.bpmn.domain.dto.catalog.cd;

import lombok.Builder;

@Builder(toBuilder = true)
public record CdDto(
        Long discographyId) {
}
