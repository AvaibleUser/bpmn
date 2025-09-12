package edu.ss1.bpmn.domain.dto.interactivity.comment;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder(toBuilder = true)
public record CommentDto(
        Long id,
        String content,
        Long userId,
        @JsonProperty("username") String userUsername,
        @JsonProperty("replyTo") Long replyToId,
        Instant createdAt,
        Instant updatedAt) {
}
