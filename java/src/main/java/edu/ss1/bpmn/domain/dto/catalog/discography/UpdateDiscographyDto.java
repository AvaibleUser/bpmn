package edu.ss1.bpmn.domain.dto.catalog.discography;

import java.math.BigDecimal;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import edu.ss1.bpmn.domain.dto.catalog.cassette.AddCassetteDto;
import edu.ss1.bpmn.domain.dto.catalog.vinyl.AddVinylDto;
import edu.ss1.bpmn.domain.type.FormatType;

public record UpdateDiscographyDto(
        String title,
        String artist,
        String imageUrl,
        Long genreId,
        Integer year,
        BigDecimal price,
        Integer stock,
        FormatType format,
        Boolean visible,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") Instant release,
        @JsonUnwrapped AddCassetteDto cassette,
        @JsonUnwrapped AddVinylDto vinyl) {
}
