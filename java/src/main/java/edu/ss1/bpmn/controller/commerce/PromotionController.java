package edu.ss1.bpmn.controller.commerce;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.domain.dto.commerce.promotion.PromotionDto;
import edu.ss1.bpmn.domain.dto.commerce.promotion.UpsertPromotionDto;
import edu.ss1.bpmn.service.commerce.PromotionService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping("/promotions")
    public Page<PromotionDto.Complete> findPromotions(Pageable pageable) {
        return promotionService.findPromotions(pageable);
    }

    @GetMapping("/promotions/{id}")
    public PromotionDto.Complete findPromotion(@PathVariable long id) {
        return promotionService.findPromotion(id);
    }

    @GetMapping("/discographies/{discographyId}/promotions")
    public List<PromotionDto> findPromotionsByCd(@PathVariable long discographyId) {
        return promotionService.findPromotionsByCd(discographyId);
    }

    @RolesAllowed("ADMIN")
    @PostMapping("/groups/{groupId}/promotions")
    @ResponseStatus(CREATED)
    public void createPromotion(@PathVariable long groupId, @RequestBody @Valid UpsertPromotionDto promotionDto) {
        promotionService.createPromotion(groupId, promotionDto);
    }

    @RolesAllowed("ADMIN")
    @PutMapping("/groups/{groupId}/promotions/{id}")
    @ResponseStatus(NO_CONTENT)
    public void updatePromotion(@PathVariable long id, @PathVariable long groupId,
            @RequestBody UpsertPromotionDto promotionDto) {
        promotionService.updatePromotion(id, groupId, promotionDto);
    }

    @RolesAllowed("ADMIN")
    @DeleteMapping("/promotions/{id}")
    @ResponseStatus(NO_CONTENT)
    public void deletePromotion(@PathVariable long id) {
        promotionService.deletePromotion(id);
    }
}
