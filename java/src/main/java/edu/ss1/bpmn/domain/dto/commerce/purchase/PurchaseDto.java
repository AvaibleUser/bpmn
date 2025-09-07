package edu.ss1.bpmn.domain.dto.commerce.purchase;

import java.math.BigDecimal;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder(toBuilder = true)
public record PurchaseDto(
        Long id,
        Long userId,
        @JsonProperty("username") String userUsername,
        Long discographyId,
        String discographyTitle,
        String discographyArtist,
        String discographyImageUrl,
        BigDecimal discographyPrice,
        Instant discographyRelease,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal total,
        Instant createdAt) {
}
