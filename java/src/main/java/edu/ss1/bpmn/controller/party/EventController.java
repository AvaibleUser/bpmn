package edu.ss1.bpmn.controller.party;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.party.event.EventDto;
import edu.ss1.bpmn.domain.dto.party.event.UpsertEventDto;
import edu.ss1.bpmn.service.party.EventService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@RolesAllowed({ "CLIENT", "ADMIN" })
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventDto> findUpcomingEvents() {
        return eventService.findUpcomingEvents();
    }

    @GetMapping("/{eventId}/finished")
    public boolean isEventFinished(@PathVariable long eventId) {
        return eventService.isEventFinished(eventId);
    }

    @GetMapping("/organizers/{organizerId}")
    public List<EventDto> findByOrganizerId(@PathVariable long organizerId) {
        return eventService.findByOrganizerId(organizerId);
    }

    @GetMapping("/{eventId}")
    public EventDto findUpcomingEvent(@PathVariable long eventId) {
        return eventService.findUpcomingEvent(eventId);
    }

    @RolesAllowed("ADMIN")
    @PostMapping
    @ResponseStatus(CREATED)
    public void createEvent(@CurrentUserId long userId, @RequestBody @Valid UpsertEventDto eventDto) {
        eventService.createEvent(userId, eventDto);
    }

    @RolesAllowed("ADMIN")
    @PutMapping("/{eventId}")
    @ResponseStatus(NO_CONTENT)
    public void updateEvent(@CurrentUserId long userId, @PathVariable long eventId,
            @RequestBody UpsertEventDto eventDto) {
        eventService.updateEvent(eventId, userId, eventDto);
    }

    @RolesAllowed("ADMIN")
    @DeleteMapping("/{eventId}")
    @ResponseStatus(NO_CONTENT)
    public void deleteEvent(@CurrentUserId long userId, @PathVariable long eventId) {
        eventService.deleteEvent(eventId, userId);
    }
}
