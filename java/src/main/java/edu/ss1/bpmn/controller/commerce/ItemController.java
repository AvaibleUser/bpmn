package edu.ss1.bpmn.controller.commerce;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.commerce.item.ItemDto;
import edu.ss1.bpmn.domain.dto.commerce.item.UpsertItemDto;
import edu.ss1.bpmn.service.commerce.ItemService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders/{orderId}/items")
@RolesAllowed({ "CLIENT", "ADMIN" })
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    public List<ItemDto.Complete> findOrderItems(@PathVariable long orderId, @CurrentUserId long userId) {
        return itemService.findOrderItems(userId, orderId);
    }

    @GetMapping("/{itemId}")
    public ItemDto.Complete findById(@CurrentUserId long userId, @PathVariable long orderId,
            @PathVariable long itemId) {
        return itemService.findOrderItem(userId, orderId, itemId);
    }

    @PostMapping("/discographies/{discographyId}")
    @ResponseStatus(CREATED)
    public void createDiscographyItem(@CurrentUserId long userId, @PathVariable long orderId,
            @PathVariable long discographyId, @RequestBody @Valid UpsertItemDto item) {
        itemService.createDiscographyItem(userId, orderId, discographyId, item);
    }

    @PostMapping("/promotions/{promotionId}")
    @ResponseStatus(CREATED)
    public void createPromotionItem(@CurrentUserId long userId, @PathVariable long orderId,
            @PathVariable long promotionId, @RequestBody @Valid UpsertItemDto item) {
        itemService.createPromotionItem(userId, orderId, promotionId, item);
    }

    @DeleteMapping("/{itemId}")
    @ResponseStatus(NO_CONTENT)
    public void deleteItem(@CurrentUserId long userId, @PathVariable long orderId, @PathVariable long itemId) {
        itemService.deleteItem(userId, orderId, itemId);
    }
}
