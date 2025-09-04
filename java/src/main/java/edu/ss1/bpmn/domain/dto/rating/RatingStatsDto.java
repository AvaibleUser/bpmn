package edu.ss1.bpmn.domain.dto.rating;

import lombok.Builder;

@Builder(toBuilder = true)
public record RatingStatsDto(
        Integer userRating,
        double mean,
        long total,
        long fiveStars,
        long fourStars,
        long threeStars,
        long twoStars,
        long oneStar) {
}
