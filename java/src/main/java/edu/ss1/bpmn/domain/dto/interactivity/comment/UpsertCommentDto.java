package edu.ss1.bpmn.domain.dto.interactivity.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder(toBuilder = true)
public record UpsertCommentDto(
        @NotBlank String content) {
}
