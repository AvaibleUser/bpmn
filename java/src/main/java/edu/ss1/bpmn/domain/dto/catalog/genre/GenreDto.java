package edu.ss1.bpmn.domain.dto.catalog.genre;

import lombok.Builder;

@Builder(toBuilder = true)
public record GenreDto(
        Long id,
        String name) {
}
