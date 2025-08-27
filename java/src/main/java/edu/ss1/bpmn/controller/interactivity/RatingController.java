package edu.ss1.bpmn.controller.interactivity;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.rating.AddRatingDto;
import edu.ss1.bpmn.domain.dto.rating.RatingStatsDto;
import edu.ss1.bpmn.service.interactivity.RatingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/discographies/{discographyId}/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @GetMapping
    public RatingStatsDto findRating(long discographyId) {
        return ratingService.findRating(discographyId);
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public void addRating(long discographyId, @CurrentUserId long userId, AddRatingDto rating) {
        ratingService.addRating(discographyId, userId, rating);
    }

    @PutMapping("/{ratingId}")
    @ResponseStatus(NO_CONTENT)
    public void updateRating(long ratingId, AddRatingDto rating) {
        ratingService.updateRating(ratingId, rating);
    }

    @DeleteMapping("/{ratingId}")
    @ResponseStatus(NO_CONTENT)
    public void deleteRating(long ratingId) {
        ratingService.deleteRating(ratingId);
    }
}
