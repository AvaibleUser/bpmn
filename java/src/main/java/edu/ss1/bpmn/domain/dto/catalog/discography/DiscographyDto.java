package edu.ss1.bpmn.domain.dto.catalog.discography;

import java.math.BigDecimal;
import java.time.Instant;

import edu.ss1.bpmn.domain.type.ConditionType;
import edu.ss1.bpmn.domain.type.FormatType;
import lombok.Builder;

@Builder(toBuilder = true)
public record DiscographyDto(
        Long id,
        String title,
        String artist,
        String imageUrl,
        String genreName,
        Integer year,
        BigDecimal price,
        Integer stock,
        FormatType format,
        Boolean visible,
        Instant release,
        Instant createdAt,
        Instant updatedAt,
        ConditionType cassetteCondition,
        Integer vinylSize,
        String vinylSpecialEdition) {
}
