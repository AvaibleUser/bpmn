package edu.ss1.bpmn.domain.dto.user;

import jakarta.validation.constraints.NotBlank;

public record RecoverUserDto(
        @NotBlank String email) {
}
