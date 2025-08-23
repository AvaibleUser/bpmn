package edu.ss1.bpmn.domain.dto.user;

import java.time.Instant;

import edu.ss1.bpmn.domain.type.RoleType;
import lombok.Builder;

@Builder(toBuilder = true)
public record UserDto(
        Long id,
        String username,
        String email,
        RoleType role,
        String firstname,
        String lastname,
        boolean verified,
        boolean active,
        boolean banned,
        Instant createdAt,
        Instant updatedAt) {
}
