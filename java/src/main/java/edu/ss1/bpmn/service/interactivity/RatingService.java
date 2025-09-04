package edu.ss1.bpmn.service.interactivity;

import java.time.Instant;
import java.util.List;
import java.util.function.Function;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.rating.AddRatingDto;
import edu.ss1.bpmn.domain.dto.rating.RatingDto;
import edu.ss1.bpmn.domain.dto.rating.RatingStatsDto;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.entity.interactivity.RatingEntity;
import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;
import edu.ss1.bpmn.domain.exception.BadRequestException;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import edu.ss1.bpmn.repository.interactivity.RatingRepository;
import edu.ss1.bpmn.repository.interactivity.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final DiscographyRepository discographyRepository;

    public RatingStatsDto findRating(long userId, long discographyId) {
        List<RatingDto> rating = ratingRepository.findAllByDiscographyIdAndDeletedFalse(discographyId, RatingDto.class);
        Integer userRating = ratingRepository.findByUserIdAndDiscographyId(userId, discographyId, RatingDto.class)
                .map(RatingDto::rating)
                .orElse(null);

        Function<Integer, Long> count = (stars) -> rating.stream().filter(r -> r.rating() == stars).count();

        return RatingStatsDto.builder()
                .userRating(userRating)
                .mean(rating.stream().mapToInt(RatingDto::rating).average().orElse(0))
                .total(rating.size())
                .fiveStars(count.apply(5))
                .fourStars(count.apply(4))
                .threeStars(count.apply(3))
                .twoStars(count.apply(2))
                .oneStar(count.apply(1))
                .build();
    }

    @Transactional
    public void addRating(long discographyId, long userId, AddRatingDto rating) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));

        DiscographyEntity discography = discographyRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        if (ratingRepository.existsByUserIdAndDiscographyId(userId, discographyId)) {
            throw new RequestConflictException("Ya existe una calificación para esta discografía");
        }
        if (rating.rating() < 1 || rating.rating() > 5) {
            throw new BadRequestException("La calificación debe ser un número entre 1 y 5");
        }

        RatingEntity ratingEntity = RatingEntity.builder()
                .discography(discography)
                .user(user)
                .rating(rating.rating())
                .build();

        ratingRepository.save(ratingEntity);
    }

    @Transactional
    public void updateRating(long discographyId, long userId, AddRatingDto rating) {
        RatingEntity ratingEntity = ratingRepository
                .findByUserIdAndDiscographyId(userId, discographyId, RatingEntity.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la calificación"));

        if (rating.rating() < 1 || rating.rating() > 5) {
            throw new BadRequestException("La calificación debe ser un número entre 1 y 5");
        }

        ratingEntity.setRating(rating.rating());

        ratingRepository.save(ratingEntity);
    }

    @Transactional
    public void deleteRating(long discographyId, long userId) {
        ratingRepository.findByUserIdAndDiscographyId(userId, discographyId, RatingEntity.class)
                .ifPresent(r -> {
                    r.setDeleted(true);
                    r.setDeletedAt(Instant.now());
                    ratingRepository.save(r);
                });
    }
}
