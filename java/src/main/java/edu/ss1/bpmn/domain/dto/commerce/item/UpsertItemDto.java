package edu.ss1.bpmn.domain.dto.commerce.item;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder(toBuilder = true)
public record UpsertItemDto(
        @NotNull Integer quantity) {
}
