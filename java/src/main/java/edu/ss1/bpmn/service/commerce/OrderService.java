package edu.ss1.bpmn.service.commerce;

import static edu.ss1.bpmn.domain.type.StatusType.CART;
import static edu.ss1.bpmn.domain.type.StatusType.PAID;
import static edu.ss1.bpmn.domain.type.StatusType.SENT;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.commerce.order.OrderDto;
import edu.ss1.bpmn.domain.dto.commerce.order.UpdateOrderDto;
import edu.ss1.bpmn.domain.entity.catalog.CdEntity;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.entity.commerce.ItemEntity;
import edu.ss1.bpmn.domain.entity.commerce.OrderEntity;
import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.domain.type.StatusType;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import edu.ss1.bpmn.repository.commerce.OrderRepository;
import edu.ss1.bpmn.repository.interactivity.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DiscographyRepository discographyRepository;

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

    @Transactional
    public Long createOrder(long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));

        if (orderRepository.existsByUserIdAndStatus(userId, CART)) {
            throw new RequestConflictException("El usuario ya tiene un pedido en espera");
        }

        return orderRepository.saveAndFlush(OrderEntity.builder()
                .user(user)
                .total(BigDecimal.ZERO)
                .status(CART)
                .build()).getId();
    }

    @Transactional
    public void updateOrder(long userId, long orderId, UpdateOrderDto order) {
        OrderEntity orderDb = orderRepository.findByIdAndUserId(orderId, userId, OrderEntity.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el pedido"));

        if (orderDb.getStatus().ordinal() != order.status().ordinal() + 1) {
            throw new RequestConflictException("La orden debe ser actualizada en el orden correcto");
        }
        if (orderDb.getStatus() == CART) {
            Hibernate.initialize(orderDb.getItems());
            if (orderDb.getItems().isEmpty()) {
                throw new RequestConflictException("La orden no puede estar vacía");
            }
        }
        if (orderDb.getStatus() == PAID) {
            Hibernate.initialize(orderDb.getItems());
            discographyRepository.saveAll(orderDb.getItems()
                    .stream()
                    .flatMap(item -> {
                        if (item.getDiscography() != null) {
                            return extractOrder(item, item.getDiscography());
                        }
                        return extractOrder(item, item.getPromotion().getCds());
                    })
                    .toList());
        }
        if (orderDb.getStatus() == SENT) {
            throw new RequestConflictException("La orden ya fue enviada");
        }

        orderDb.setStatus(order.status());
        orderRepository.save(orderDb);
    }

    private Stream<DiscographyEntity> extractOrder(ItemEntity item, DiscographyEntity discography) {
        if (discography.getStock() < item.getQuantity()) {
            throw new RequestConflictException(
                    "La cantidad solicitada es mayor que la existente en stock");
        }
        if (discography.getStock() != null) {
            discography.setStock(discography.getStock() - item.getQuantity());
        }
        return Stream.of(discography);
    }

    private Stream<DiscographyEntity> extractOrder(ItemEntity item, Set<CdEntity> cds) {
        if (cds.stream()
                .map(CdEntity::getDiscography)
                .map(DiscographyEntity::getStock)
                .filter(s -> s != null)
                .anyMatch(s -> s < item.getQuantity())) {
            throw new RequestConflictException(
                    "No hay stock suficiente para reclamar la promoción %s veces"
                            .formatted(item.getQuantity()));
        }
        return cds.stream()
                .map(CdEntity::getDiscography)
                .map(d -> {
                    if (d.getStock() != null) {
                        d.setStock(d.getStock() - item.getQuantity());
                    }
                    return d;
                });
    }

    @Transactional
    public void completeOrder(long userId, long orderId) {
        updateOrder(userId, orderId, new UpdateOrderDto(PAID));
    }

    @Transactional
    public void deleteOrder(long userId, long orderId) {
        orderRepository.findByIdAndUserId(orderId, userId, OrderEntity.class)
                .ifPresent(order -> {
                    if (order.getStatus() != CART) {
                        throw new RequestConflictException("El pedido no puede ser borrado, ni ser cancelado");
                    }
                    orderRepository.delete(order);
                });
    }
}
