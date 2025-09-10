package edu.ss1.bpmn.service.commerce;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.commerce.purchase.AddPurchaseDto;
import edu.ss1.bpmn.domain.dto.commerce.purchase.PurchaseDto;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.entity.commerce.PurchaseEntity;
import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import edu.ss1.bpmn.repository.commerce.PurchaseRepository;
import edu.ss1.bpmn.repository.interactivity.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final UserRepository userRepository;
    private final DiscographyRepository discographyRepository;

    public List<PurchaseDto> findAll() {
        return purchaseRepository.findAllBy(PurchaseDto.class);
    }

    public PurchaseDto findById(long id) {
        return purchaseRepository.findById(id, PurchaseDto.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la compra"));
    }

    public List<PurchaseDto> findByUserId(long userId) {
        return purchaseRepository.findByUserId(userId, PurchaseDto.class);
    }

    @Transactional
    public void createPurchase(long userId, long discographyId, AddPurchaseDto purchase) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));
        DiscographyEntity discography = discographyRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        if (!user.isActive() || user.isBanned()) {
            throw new RequestConflictException("El usuario se encuentra baneado o no está activo");
        }
        if (!discography.isVisible()) {
            throw new RequestConflictException("La discografía se encuentra oculta");
        }

        purchaseRepository.save(PurchaseEntity.builder()
                .user(user)
                .discography(discography)
                .quantity(purchase.quantity())
                .unitPrice(discography.getPrice())
                .total(discography.getPrice().multiply(BigDecimal.valueOf(purchase.quantity())))
                .build());

        if (discography.getStock() == null) {
            discography.setStock(0);
        }

        discography.setStock(discography.getStock() + purchase.quantity());
        discographyRepository.save(discography);
    }
}
