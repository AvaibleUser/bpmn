package edu.ss1.bpmn.controller.commerce;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.commerce.wishlist.UpsertWishlistDto;
import edu.ss1.bpmn.domain.dto.commerce.wishlist.WishlistDto;
import edu.ss1.bpmn.service.commerce.WishlistService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/discographies/{discographyId}/wishlists")
    public List<WishlistDto> findDiscographyWishlist(@PathVariable long discographyId) {
        return wishlistService.findDiscographyWishlist(discographyId);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @GetMapping("/wishlists")
    public List<WishlistDto> findUserWishlist(@CurrentUserId long userId,
            @RequestParam(required = false) Boolean paid) {
        return wishlistService.findUserWishlist(userId, paid);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @GetMapping("/wishlists/{id}")
    public Optional<WishlistDto> findWishlistById(@PathVariable long id) {
        return wishlistService.findWishlistById(id);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @PostMapping("/discographies/{discographyId}/wishlists")
    @ResponseStatus(CREATED)
    public void createWishlist(@PathVariable long discographyId, @CurrentUserId long userId,
            @RequestBody @Valid UpsertWishlistDto wishlist) {
        wishlistService.addWishlist(userId, discographyId, wishlist);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @PutMapping("/discographies/{discographyId}/wishlists")
    @ResponseStatus(NO_CONTENT)
    public void updateWishlist(@PathVariable long discographyId, @CurrentUserId long userId,
            @RequestBody UpsertWishlistDto wishlist) {
        wishlistService.updateWishlist(userId, discographyId, wishlist);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @DeleteMapping("/discographies/{discographyId}/wishlists")
    @ResponseStatus(NO_CONTENT)
    public void deleteWishlist(@PathVariable long discographyId, @CurrentUserId long userId) {
        wishlistService.deleteWishlist(userId, discographyId);
    }
}
