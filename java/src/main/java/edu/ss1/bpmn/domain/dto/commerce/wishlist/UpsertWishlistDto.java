package edu.ss1.bpmn.domain.dto.commerce.wishlist;

import lombok.Builder;

@Builder(toBuilder = true)
public record UpsertWishlistDto(
        boolean paid) {
}
