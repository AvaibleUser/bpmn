package edu.ss1.bpmn.domain.dto.commerce.promotion;

import java.time.LocalDate;
import java.util.Set;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder(toBuilder = true)
public record UpsertPromotionDto(
        @NotNull @Future LocalDate startDate,
        @Future LocalDate endDate,
        @NotNull @NotEmpty Set<Long> cdIds) {
}
