package edu.ss1.bpmn.domain.dto.commerce.item;

import java.math.BigDecimal;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import edu.ss1.bpmn.domain.dto.catalog.discography.DiscographyDto;
import edu.ss1.bpmn.domain.dto.commerce.promotion.PromotionDto;
import lombok.Builder;

@Builder(toBuilder = true)
public record ItemDto(
        Long id,
        Long discographyId,
        Long promotionId,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal,
        Instant createdAt) {

    @Builder(toBuilder = true)
    public static record Complete(
            @JsonUnwrapped ItemDto item,
            DiscographyDto discography,
            PromotionDto.Complete promotion) {
    }
}
