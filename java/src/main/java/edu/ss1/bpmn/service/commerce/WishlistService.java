package edu.ss1.bpmn.service.commerce;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.commerce.wishlist.UpsertWishlistDto;
import edu.ss1.bpmn.domain.dto.commerce.wishlist.WishlistDto;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.entity.commerce.WishlistEntity;
import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import edu.ss1.bpmn.repository.commerce.WishlistRepository;
import edu.ss1.bpmn.repository.interactivity.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final DiscographyRepository discographyRepository;

    public Optional<WishlistDto> findWishlistById(long id) {
        return wishlistRepository.findById(id, WishlistDto.class);
    }

    public List<WishlistDto> findUserWishlist(long userId, Boolean paid) {
        if (paid == null) {
            return wishlistRepository.findByUserId(userId, WishlistDto.class);
        }
        return wishlistRepository.findByUserIdAndPaid(userId, paid, WishlistDto.class);
    }

    public List<WishlistDto> findDiscographyWishlist(long discographyId) {
        return wishlistRepository.findByDiscographyId(discographyId, WishlistDto.class);
    }

    @Transactional
    public void addWishlist(long userId, long discographyId, UpsertWishlistDto wishlist) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));
        DiscographyEntity discography = discographyRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        if (wishlistRepository.existsByUserIdAndDiscographyId(userId, discographyId)) {
            throw new RequestConflictException("La discografía ya se encuentra en la wishlist");
        }
        wishlistRepository.save(WishlistEntity.builder()
                .user(user)
                .discography(discography)
                .paid(wishlist.paid())
                .build());
    }

    @Transactional
    public void updateWishlist(long userId, long discographyId, UpsertWishlistDto wishlist) {
        WishlistEntity wishlistEntity = wishlistRepository
                .findByUserIdAndDiscographyId(userId, discographyId, WishlistEntity.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la wishlist"));

        wishlistEntity.setPaid(wishlist.paid());

        wishlistRepository.save(wishlistEntity);
    }

    @Transactional
    public void deleteWishlist(long userId, long discographyId) {
        wishlistRepository.deleteByUserIdAndDiscographyId(userId, discographyId);
    }
}
