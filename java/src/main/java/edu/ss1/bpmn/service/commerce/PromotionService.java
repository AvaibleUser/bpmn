package edu.ss1.bpmn.service.commerce;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.catalog.discography.DiscographyDto;
import edu.ss1.bpmn.domain.dto.commerce.promotion.PromotionDto;
import edu.ss1.bpmn.domain.dto.commerce.promotion.UpsertPromotionDto;
import edu.ss1.bpmn.domain.entity.catalog.CdEntity;
import edu.ss1.bpmn.domain.entity.commerce.GroupingTypeEntity;
import edu.ss1.bpmn.domain.entity.commerce.PromotionEntity;
import edu.ss1.bpmn.domain.exception.BadRequestException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.catalog.CdRepository;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import edu.ss1.bpmn.repository.commerce.GroupingTypeRepository;
import edu.ss1.bpmn.repository.commerce.PromotionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final GroupingTypeRepository groupRepository;
    private final CdRepository cdRepository;
    private final DiscographyRepository discographyRepository;

    public Page<PromotionDto.Complete> findPromotions(Pageable pageable) {
        Page<PromotionDto> promotions = promotionRepository.findByAvailable(PromotionDto.class, pageable);
        return new PageImpl<PromotionDto.Complete>(promotions.getContent()
                .stream()
                .filter(promo -> promo.endDate() == null || promo.endDate().isAfter(LocalDate.now()))
                .map(promo -> PromotionDto.Complete.builder()
                        .cds(discographyRepository.findByCdPromotionsId(promo.id(), DiscographyDto.class))
                        .promotion(promo)
                        .build())
                .toList(),
                promotions.getPageable(), promotions.getTotalElements());
    }

    public List<PromotionDto> findPromotionsByCd(long discographyId) {
        return promotionRepository.findByCdsDiscographyIdAndActiveTrue(discographyId, PromotionDto.class);
    }

    public PromotionDto.Complete findPromotion(Long id) {
        return promotionRepository.findByIdAndAvailable(id, PromotionDto.class)
                .map(promo -> PromotionDto.Complete.builder()
                        .cds(discographyRepository.findByCdPromotionsId(promo.id(), DiscographyDto.class))
                        .promotion(promo)
                        .build())
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
                .name(promotionDto.name())
                .description(promotionDto.description())
                .groupType(groupType)
                .startDate(promotionDto.startDate())
                .endDate(groupType.isLimitedTime() ? promotionDto.endDate() : null)
                .active(true)
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

        promotion.setName(promotionDto.name());
        promotion.setDescription(promotionDto.description());
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
