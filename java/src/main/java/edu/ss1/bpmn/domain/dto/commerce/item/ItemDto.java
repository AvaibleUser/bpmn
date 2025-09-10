package edu.ss1.bpmn.domain.dto.commerce.item;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

import lombok.Builder;

@Builder(toBuilder = true)
public record ItemDto(
        Long id,
        Long discographyId,
        String discographyTitle,
        String discographyArtist,
        String discographyImageUrl,
        BigDecimal discographyPrice,
        Instant discographyRelease,
        Long promotionId,
        String promotionGroupTypeName,
        BigDecimal promotionGroupTypeDiscount,
        Set<Long> promotionCdsDiscographyId,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal,
        Instant createdAt) {
}
