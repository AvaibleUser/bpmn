package edu.ss1.bpmn.domain.dto.comment;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder(toBuilder = true)
public record CommentDto(
        long id,
        String content,
        @JsonProperty("username") String userUsername,
        @JsonProperty("reply_to") long replyToId,
        Instant createdAt,
        Instant updatedAt) {
}
