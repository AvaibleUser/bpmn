package edu.ss1.bpmn.domain.dto.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder(toBuilder = true)
public record UpsertCommentDto(
        @NotBlank String content) {
}
