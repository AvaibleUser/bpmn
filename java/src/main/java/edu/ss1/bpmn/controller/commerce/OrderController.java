package edu.ss1.bpmn.controller.commerce;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.commerce.order.OrderDto;
import edu.ss1.bpmn.domain.dto.commerce.order.UpdateOrderDto;
import edu.ss1.bpmn.domain.type.StatusType;
import edu.ss1.bpmn.service.commerce.OrderService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RolesAllowed("CLIENT")
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderDto> findByUserId(@CurrentUserId long userId, @RequestParam(required = false) StatusType status) {
        return orderService.findByUserIdAndStatus(userId, status);
    }

    @GetMapping("/{orderId}")
    public OrderDto findById(@CurrentUserId long userId, @PathVariable long orderId) {
        return orderService.findByIdAndUserId(userId, orderId);
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public void createOrder(@CurrentUserId long userId) {
        orderService.createOrder(userId);
    }

    @PutMapping("/{orderId}")
    @ResponseStatus(NO_CONTENT)
    public void updateOrder(@CurrentUserId long userId, @PathVariable long orderId, UpdateOrderDto order) {
        orderService.updateOrder(userId, orderId, order);
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(NO_CONTENT)
    public void deleteOrder(@CurrentUserId long userId, @PathVariable long orderId) {
        orderService.deleteOrder(userId, orderId);
    }
}
