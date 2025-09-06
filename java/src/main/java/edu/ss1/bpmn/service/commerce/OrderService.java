package edu.ss1.bpmn.service.commerce;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import edu.ss1.bpmn.domain.dto.commerce.order.OrderDto;
import edu.ss1.bpmn.domain.dto.commerce.order.UpdateOrderDto;
import edu.ss1.bpmn.domain.entity.commerce.OrderEntity;
import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.domain.type.StatusType;
import edu.ss1.bpmn.repository.commerce.OrderRepository;
import edu.ss1.bpmn.repository.interactivity.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderDto findByIdAndUserId(long userId, long orderId) {
        return orderRepository.findByIdAndUserId(orderId, userId, OrderDto.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el pedido"));
    }

    public List<OrderDto> findByUserIdAndStatus(long userId, StatusType status) {
        if (status == null) {
            return orderRepository.findByUserId(userId, OrderDto.class);
        }
        return orderRepository.findByUserIdAndStatus(userId, status, OrderDto.class);
    }

    public void createOrder(long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));

        orderRepository.save(OrderEntity.builder()
                .user(user)
                .total(BigDecimal.ZERO)
                .status(StatusType.ON_HOLD)
                .build());
    }

    public void updateOrder(long userId, long orderId, UpdateOrderDto order) {
        OrderEntity orderDb = orderRepository.findByIdAndUserId(orderId, userId, OrderEntity.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el pedido"));

        orderDb.setStatus(order.status());
        orderRepository.save(orderDb);
    }

    public void deleteOrder(long userId, long orderId) {
        orderRepository.findByIdAndUserId(orderId, userId, OrderEntity.class)
                .ifPresent(order -> {
                    if (order.getStatus() != StatusType.ON_HOLD) {
                        throw new RuntimeException("El pedido no puede ser borrado");
                    }
                    orderRepository.delete(order);
                });
    }
}
