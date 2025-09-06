package edu.ss1.bpmn.domain.dto.commerce.order;

import edu.ss1.bpmn.domain.type.StatusType;
import lombok.Builder;

@Builder(toBuilder = true)
public record UpdateOrderDto(
        StatusType status) {
}
