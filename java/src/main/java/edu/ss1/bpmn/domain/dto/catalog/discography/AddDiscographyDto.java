package edu.ss1.bpmn.domain.dto.catalog.discography;

import java.math.BigDecimal;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import edu.ss1.bpmn.domain.dto.catalog.cassette.AddCassetteDto;
import edu.ss1.bpmn.domain.dto.catalog.vinyl.AddVinylDto;
import edu.ss1.bpmn.domain.type.FormatType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record AddDiscographyDto(
        @NotBlank String title,
        @NotBlank String artist,
        String imageUrl,
        @NotNull Long genreId,
        @NotNull @Positive Integer year,
        @NotNull @Positive BigDecimal price,
        @PositiveOrZero Integer stock,
        @NotNull FormatType format,
        boolean visible,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") @Future Instant release,
        @JsonUnwrapped AddCassetteDto cassette,
        @JsonUnwrapped AddVinylDto vinyl) {
}
