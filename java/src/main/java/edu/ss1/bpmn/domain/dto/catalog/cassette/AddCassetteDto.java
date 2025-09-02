package edu.ss1.bpmn.domain.dto.catalog.cassette;

import edu.ss1.bpmn.domain.type.ConditionType;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder(toBuilder = true)
public record AddCassetteDto(
        @NotNull ConditionType condition) {
}
