package edu.ss1.bpmn.domain.dto.commerce.purchase;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder(toBuilder = true)
public record AddPurchaseDto(
        @NotNull @Positive Integer quantity,
        @NotNull @Positive BigDecimal unitPrice) {
}
