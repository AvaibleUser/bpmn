package edu.ss1.bpmn.domain.dto.interactivity.comment;

import java.util.List;

import lombok.Builder;

@Builder(toBuilder = true)
public record CommentsDto(
        boolean byUser,
        List<CommentDto> comments) {
}
