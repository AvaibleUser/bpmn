package edu.ss1.bpmn.domain.dto.catalog.song;

import edu.ss1.bpmn.domain.type.SideType;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder(toBuilder = true)
public record AddSongDto(
        @NotBlank String name,
        SideType side,
        String url) {
}
