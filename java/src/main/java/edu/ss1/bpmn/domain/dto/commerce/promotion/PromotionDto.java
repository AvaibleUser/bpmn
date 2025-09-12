package edu.ss1.bpmn.domain.dto.commerce.promotion;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import edu.ss1.bpmn.domain.dto.catalog.discography.DiscographyDto;
import lombok.Builder;

@Builder(toBuilder = true)
public record PromotionDto(
        Long id,
        String name,
        String description,
        Long groupTypeId,
        LocalDate startDate,
        LocalDate endDate,
        Instant createdAt,
        Instant updatedAt,
        BigDecimal groupTypeDiscount) {

    @Builder(toBuilder = true)
    public static record Complete(
            @JsonUnwrapped PromotionDto promotion,
            Set<DiscographyDto> cds) {
    }
}
