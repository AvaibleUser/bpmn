package edu.ss1.bpmn.service.commerce;

import static edu.ss1.bpmn.domain.type.StatusType.CART;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import edu.ss1.bpmn.domain.dto.commerce.item.ItemDto;
import edu.ss1.bpmn.domain.dto.commerce.item.UpsertItemDto;
import edu.ss1.bpmn.domain.entity.catalog.CdEntity;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.entity.commerce.ItemEntity;
import edu.ss1.bpmn.domain.entity.commerce.OrderEntity;
import edu.ss1.bpmn.domain.entity.commerce.PromotionEntity;
import edu.ss1.bpmn.domain.exception.BadRequestException;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import edu.ss1.bpmn.repository.commerce.ItemRepository;
import edu.ss1.bpmn.repository.commerce.OrderRepository;
import edu.ss1.bpmn.repository.commerce.PromotionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final OrderRepository orderRepository;
    private final DiscographyRepository discographyRepository;
    private final PromotionRepository promotionRepository;

    public ItemDto findOrderItem(long userId, long orderId, long itemId) {
        return itemRepository.findByIdAndOrderUserIdAndOrderId(itemId, userId, orderId, ItemDto.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el detalle de la factura"));
    }

    public List<ItemDto> findOrderItems(long userId, long orderId) {
        return itemRepository.findByOrderUserIdAndOrderId(userId, orderId, ItemDto.class);
    }

    @Transactional
    private void createItem(long userId, long orderId, UpsertItemDto item, BigDecimal subtotal,
            BigDecimal unirPrice, DiscographyEntity discography, PromotionEntity promotion) {
        OrderEntity order = orderRepository.findByIdAndUserId(orderId, userId, OrderEntity.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el pedido"));

        if (order.getStatus() != CART) {
            throw new BadRequestException("El pedido ya no puede ser modificado");
        }
        if (item.quantity() < 1) {
            throw new BadRequestException("La cantidad debe ser mayor a 0");
        }

        itemRepository.save(ItemEntity.builder()
                .order(order)
                .discography(discography)
                .promotion(promotion)
                .quantity(item.quantity())
                .unitPrice(unirPrice)
                .subtotal(subtotal)
                .build());

        order.setTotal(order.getTotal().add(subtotal));
        orderRepository.save(order);
    }

    @Transactional
    public void createPromotionItem(long userId, long orderId, long promotionId, UpsertItemDto item) {
        PromotionEntity promotion = promotionRepository.findByIdAndAvailable(promotionId, PromotionEntity.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la promoción o ya terminó"));

        if (itemRepository.existsByOrderIdAndPromotionId(orderId, promotionId)) {
            throw new RequestConflictException("La promoción ya se encuentra en el pedido");
        }
        Hibernate.initialize(promotion.getCds());
        if (promotion.getCds()
                .stream()
                .map(CdEntity::getDiscography)
                .map(DiscographyEntity::getStock)
                .anyMatch(s -> s != null && s < item.quantity())) {
            throw new BadRequestException(
                    "No hay stock suficiente para reclamar la promoción %s veces".formatted(item.quantity()));
        }

        Optional<BigDecimal> unitPrice = promotion.getCds()
                .stream()
                .map(CdEntity::getDiscography)
                .map(DiscographyEntity::getPrice)
                .reduce(BigDecimal::add);
        BigDecimal subtotalDiscounted = unitPrice
                .map(subtotal -> subtotal.multiply(BigDecimal.ONE.subtract(promotion.getGroupType().getDiscount())))
                .map(subtotal -> subtotal.multiply(BigDecimal.valueOf(item.quantity())))
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el descuento"));
        createItem(userId, orderId, item, subtotalDiscounted, unitPrice.get(), null, promotion);
    }

    @Transactional
    public void createDiscographyItem(long userId, long orderId, long discographyId, UpsertItemDto item) {
        DiscographyEntity discography = discographyRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        if (itemRepository.existsByOrderIdAndDiscographyId(orderId, discographyId)) {
            throw new RequestConflictException("La discografía ya se encuentra en el pedido");
        }
        if (discography.getStock() != null && item.quantity() > discography.getStock()) {
            throw new BadRequestException("La cantidad solicitada es mayor que la existente en stock");
        }

        BigDecimal unitPrice = discography.getPrice();
        BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(item.quantity()));
        createItem(userId, orderId, item, subtotal, unitPrice, discography, null);
    }

    @Transactional
    public void deleteItem(long userId, long orderId, long itemId) {
        itemRepository.findByIdAndOrderUserIdAndOrderId(itemId, userId, orderId, ItemEntity.class)
                .ifPresent(item -> {
                    OrderEntity order = item.getOrder();

                    if (order.getStatus() != CART) {
                        throw new BadRequestException("El pedido ya no puede ser modificado");
                    }
                    order.setTotal(order.getTotal().subtract(item.getSubtotal()));
                    orderRepository.save(order);

                    itemRepository.delete(item);
                });
    }
}
