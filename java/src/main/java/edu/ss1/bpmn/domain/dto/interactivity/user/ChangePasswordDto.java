package edu.ss1.bpmn.domain.dto.interactivity.user;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordDto(
        @NotBlank String email,
        @NotBlank String code,
        @NotBlank String password,
        @NotBlank String newPassword) {
}
