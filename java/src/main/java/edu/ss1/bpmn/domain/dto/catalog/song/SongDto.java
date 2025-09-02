package edu.ss1.bpmn.domain.dto.catalog.song;

import edu.ss1.bpmn.domain.type.SideType;
import lombok.Builder;

@Builder(toBuilder = true)
public record SongDto(
        Long id,
        Long discographyId,
        String name,
        SideType side,
        String url) {
}
