package edu.ss1.bpmn.domain.dto.commerce.wishlist;

import java.math.BigDecimal;
import java.time.Instant;

import lombok.Builder;

@Builder(toBuilder = true)
public record WishlistDto(
        Long id,
        Long userId,
        String userUsername,
        Long discographyId,
        String discographyTitle,
        String discographyArtist,
        String discographyImageUrl,
        BigDecimal discographyPrice,
        Instant discographyRelease,
        boolean paid,
        Instant createdAt) {
}
