package edu.ss1.bpmn.domain.dto.interactivity.user;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

public record TokenDto(
        String token,
        @JsonUnwrapped UserDto user) {
}
