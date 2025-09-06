package edu.ss1.bpmn.domain.dto.commerce.group;

import java.math.BigDecimal;

import lombok.Builder;

@Builder(toBuilder = true)
public record GroupingTypeDto(
        Long id,
        String name,
        BigDecimal discount,
        Integer cdsLimit,
        Boolean limitedTime) {
}
