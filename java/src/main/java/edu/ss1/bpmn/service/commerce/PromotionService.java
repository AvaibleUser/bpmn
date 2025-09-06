package edu.ss1.bpmn.service.commerce;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.commerce.promotion.PromotionDto;
import edu.ss1.bpmn.domain.dto.commerce.promotion.UpsertPromotionDto;
import edu.ss1.bpmn.domain.entity.catalog.CdEntity;
import edu.ss1.bpmn.domain.entity.commerce.GroupingTypeEntity;
import edu.ss1.bpmn.domain.entity.commerce.PromotionEntity;
import edu.ss1.bpmn.domain.exception.BadRequestException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.catalog.CdRepository;
import edu.ss1.bpmn.repository.commerce.GroupingTypeRepository;
import edu.ss1.bpmn.repository.commerce.PromotionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final GroupingTypeRepository groupRepository;
    private final CdRepository cdRepository;

    public List<PromotionDto> findPromotions() {
        return promotionRepository.findByAvailable(PromotionDto.class);
    }

    public List<PromotionDto> findPromotionsByCd(long discographyId) {
        return promotionRepository.findByCdsDiscographyIdAndActiveTrue(discographyId, PromotionDto.class);
    }

    public PromotionDto findPromotion(Long id) {
        return promotionRepository.findByIdAndAvailable(id, PromotionDto.class)
                .orElseThrow(() -> new ValueNotFoundException("La promoción no existe"));
    }

    @Transactional
    public void createPromotion(long groupId, UpsertPromotionDto promotionDto) {
        GroupingTypeEntity groupType = groupRepository.findById(groupId)
                .orElseThrow(() -> new BadRequestException("El tipo de agrupación no existe"));
        Set<CdEntity> cds = cdRepository.findAllByDiscographyIdIn(promotionDto.cdIds(), CdEntity.class);

        if (groupType.isLimitedTime()) {
            if (promotionDto.endDate() == null) {
                throw new BadRequestException("La fecha de fin es requerida");
            } else if (promotionDto.endDate().isBefore(promotionDto.startDate())) {
                throw new BadRequestException("La fecha de fin debe ser posterior a la fecha de inicio");
            }
        }
        if (cds.size() != promotionDto.cdIds().size()) {
            throw new BadRequestException("No se encontraron todas los cds");
        }
        if (groupType.getCdsLimit() < promotionDto.cdIds().size()) {
            throw new BadRequestException(
                    "La promoción no puede superar el límite de %s cds".formatted(groupType.getCdsLimit()));
        }

        promotionRepository.save(PromotionEntity.builder()
                .groupType(groupType)
                .startDate(promotionDto.startDate())
                .endDate(groupType.isLimitedTime() ? promotionDto.endDate() : null)
                .cds(cds)
                .build());
    }

    @Transactional
    public void updatePromotion(long id, long groupId, UpsertPromotionDto promotionDto) {
        PromotionEntity promotion = promotionRepository
                .findByIdAndGroupTypeIdAndActiveTrue(id, groupId, PromotionEntity.class)
                .orElseThrow(() -> new BadRequestException("La promoción no existe"));
        GroupingTypeEntity groupType = groupRepository.findById(groupId)
                .orElseThrow(() -> new BadRequestException("El tipo de agrupación no existe"));
        Set<CdEntity> cds = cdRepository.findAllByDiscographyIdIn(promotionDto.cdIds(), CdEntity.class);

        if (groupType.isLimitedTime()) {
            if (promotionDto.endDate() == null) {
                throw new BadRequestException("La fecha de fin es requerida");
            } else if (promotionDto.endDate().isBefore(promotionDto.startDate())) {
                throw new BadRequestException("La fecha de fin debe ser posterior a la fecha de inicio");
            }
        }
        if (cds.size() != promotionDto.cdIds().size()) {
            throw new BadRequestException("No se encontraron todas los cds");
        }
        if (groupType.getCdsLimit() < promotionDto.cdIds().size()) {
            throw new BadRequestException(
                    "La promoción no puede superar el límite de %s cds".formatted(groupType.getCdsLimit()));
        }

        promotion.setStartDate(promotionDto.startDate());
        promotion.setEndDate(groupType.isLimitedTime() ? promotionDto.endDate() : null);
        promotion.setCds(cds);

        promotionRepository.save(promotion);
    }

    @Transactional
    public void deletePromotion(long id) {
        promotionRepository.findByIdAndActiveTrue(id, PromotionEntity.class)
                .ifPresent(promotion -> {
                    promotion.setActive(false);
                    promotionRepository.save(promotion);
                });
    }
}
