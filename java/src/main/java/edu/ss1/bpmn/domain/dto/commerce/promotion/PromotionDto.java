package edu.ss1.bpmn.domain.dto.commerce.promotion;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

import lombok.Builder;

@Builder(toBuilder = true)
public record PromotionDto(
        Long id,
        Long groupingTypeId,
        LocalDate startDate,
        LocalDate endDate,
        Instant createdAt,
        Instant updatedAt,
        Set<Long> cdsDiscographyId) {
}
