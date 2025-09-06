package edu.ss1.bpmn.controller.party;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.party.registration.RegistrationDto;
import edu.ss1.bpmn.service.party.RegistrationService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RolesAllowed({ "ADMIN", "CLIENT" })
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @GetMapping("/registrations")
    public List<RegistrationDto> findUserUpcomingEvents(@CurrentUserId long userId,
            @RequestParam(defaultValue = "false") boolean upcoming) {
        if (upcoming) {
            return registrationService.findUserUpcomingEvents(userId);
        }
        return registrationService.findByUserId(userId);
    }

    @GetMapping("/events/{eventId}/registrations")
    public List<RegistrationDto> findByEventId(@PathVariable long eventId) {
        return registrationService.findByEventId(eventId);
    }

    @PostMapping("/events/{eventId}/registrations")
    @ResponseStatus(CREATED)
    public void createRegistration(@CurrentUserId long userId, @PathVariable long eventId) {
        registrationService.createRegistration(userId, eventId);
    }

    @DeleteMapping("/events/{eventId}/registrations")
    @ResponseStatus(NO_CONTENT)
    public void deleteRegistration(@CurrentUserId long userId, @PathVariable long eventId) {
        registrationService.deleteRegistration(userId, eventId);
    }
}
