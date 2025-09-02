package edu.ss1.bpmn.domain.dto.catalog.discography;

import edu.ss1.bpmn.domain.type.FormatType;
import lombok.Builder;

@Builder(toBuilder = true)
public record FilterDiscographyDto(
        String title,
        String artist,
        Long genreId,
        Integer year,
        Integer priceLower,
        Integer priceUpper,
        FormatType format,
        Boolean released,
        Integer page,
        Integer size,
        String sort,
        String order) {
}
