package edu.ss1.bpmn.domain.dto.interactivity.user;

import jakarta.validation.constraints.NotBlank;

public record ConfirmUserDto(
        @NotBlank String email,
        @NotBlank String code) {
}
