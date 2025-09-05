package edu.ss1.bpmn.controller.interactivity;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.annotation.CurrentUser;
import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.interactivity.rating.AddRatingDto;
import edu.ss1.bpmn.domain.dto.interactivity.rating.RatingStatsDto;
import edu.ss1.bpmn.service.interactivity.RatingService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/discographies/{discographyId}/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @GetMapping
    public RatingStatsDto findRating(@PathVariable long discographyId, @CurrentUser long userId) {
        return ratingService.findRating(userId, discographyId);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @PostMapping
    @ResponseStatus(CREATED)
    public void addRating(@PathVariable long discographyId, @CurrentUserId long userId, AddRatingDto rating) {
        ratingService.addRating(discographyId, userId, rating);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @PutMapping
    @ResponseStatus(NO_CONTENT)
    public void updateRating(@PathVariable long discographyId, @CurrentUserId long userId, AddRatingDto rating) {
        ratingService.updateRating(discographyId, userId, rating);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @DeleteMapping
    @ResponseStatus(NO_CONTENT)
    public void deleteRating(@PathVariable long discographyId, @CurrentUserId long userId) {
        ratingService.deleteRating(discographyId, userId);
    }
}
