package edu.ss1.bpmn.domain.dto.catalog.discography;

import edu.ss1.bpmn.domain.type.FormatType;
import lombok.Builder;

@Builder(toBuilder = true)
public record FilterDiscographyDto(
        String title,
        String artist,
        Long genreId,
        Integer stock,
        Boolean bestSellers,
        Integer year,
        Integer priceMin,
        Integer priceMax,
        FormatType format,
        Boolean released) {
}
