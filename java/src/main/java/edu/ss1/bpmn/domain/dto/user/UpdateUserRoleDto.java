package edu.ss1.bpmn.domain.dto.user;

import edu.ss1.bpmn.domain.type.RoleType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder(toBuilder = true)
public record UpdateUserRoleDto(
        @NotNull @Min(1) Long userId,
        RoleType role) {
}
