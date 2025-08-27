package edu.ss1.bpmn.domain.dto.rating;

import lombok.Builder;

@Builder(toBuilder = true)
public record RatingDto(
        int rating) {
}
