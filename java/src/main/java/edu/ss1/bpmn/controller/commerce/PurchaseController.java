package edu.ss1.bpmn.controller.commerce;

import static org.springframework.http.HttpStatus.CREATED;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.commerce.purchase.AddPurchaseDto;
import edu.ss1.bpmn.domain.dto.commerce.purchase.PurchaseDto;
import edu.ss1.bpmn.service.commerce.PurchaseService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RolesAllowed("ADMIN")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @GetMapping("/purchases")
    public List<PurchaseDto> findAll() {
        return purchaseService.findAll();
    }

    @GetMapping("/purchases/me")
    public List<PurchaseDto> findByUserId(@CurrentUserId long userId) {
        return purchaseService.findByUserId(userId);
    }

    @GetMapping("/purchases/{id}")
    public PurchaseDto findById(@PathVariable long id) {
        return purchaseService.findById(id);
    }

    @PostMapping("/discographies/{discographyId}/purchases")
    @ResponseStatus(CREATED)
    public void createPurchase(@CurrentUserId long userId, @PathVariable long discographyId,
            @Valid AddPurchaseDto purchase) {
        purchaseService.createPurchase(userId, discographyId, purchase);
    }
}
