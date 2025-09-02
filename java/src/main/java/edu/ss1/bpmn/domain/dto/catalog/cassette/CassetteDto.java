package edu.ss1.bpmn.domain.dto.catalog.cassette;

import edu.ss1.bpmn.domain.type.ConditionType;
import lombok.Builder;

@Builder(toBuilder = true)
public record CassetteDto(
        Long discographyId,
        ConditionType condition) {
}
