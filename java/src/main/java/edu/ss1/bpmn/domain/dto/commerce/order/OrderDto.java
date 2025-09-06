package edu.ss1.bpmn.domain.dto.commerce.order;

import java.math.BigDecimal;
import java.time.Instant;

import edu.ss1.bpmn.domain.type.StatusType;
import lombok.Builder;

@Builder(toBuilder = true)
public record OrderDto(
        Long id,
        BigDecimal total,
        StatusType status,
        Instant createdAt) {
}
