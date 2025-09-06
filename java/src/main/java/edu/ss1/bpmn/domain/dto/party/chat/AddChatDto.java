package edu.ss1.bpmn.domain.dto.party.chat;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder(toBuilder = true)
public record AddChatDto(
        @NotBlank String content) {
}
