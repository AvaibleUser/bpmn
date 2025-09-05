package edu.ss1.bpmn.domain.dto.interactivity.user;

import jakarta.validation.constraints.NotBlank;

public record AuthUserDto(
        @NotBlank String email,
        @NotBlank String password) {
}
