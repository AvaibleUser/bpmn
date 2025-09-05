package edu.ss1.bpmn.domain.dto.interactivity.rating;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Builder;

@Builder(toBuilder = true)
public record AddRatingDto(
        @Min(1) @Max(5) int rating) {
}
