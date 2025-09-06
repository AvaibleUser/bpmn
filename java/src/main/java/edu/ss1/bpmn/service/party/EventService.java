package edu.ss1.bpmn.service.party;

import java.util.List;

import org.apache.commons.lang3.ObjectUtils;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import edu.ss1.bpmn.domain.dto.party.event.EventDto;
import edu.ss1.bpmn.domain.dto.party.event.UpsertEventDto;
import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;
import edu.ss1.bpmn.domain.entity.party.EventEntity;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.interactivity.UserRepository;
import edu.ss1.bpmn.repository.party.EventRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventDto findUpcomingEvent(long id) {
        return eventRepository.findUpcomingEvent(id, EventDto.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el evento"));
    }

    public List<EventDto> findUpcomingEvents() {
        return eventRepository.findUpcomingEvents(EventDto.class);
    }

    public List<EventDto> findByOrganizerId(long id) {
        return eventRepository.findByOrganizerId(id, EventDto.class);
    }

    public void createEvent(long organizerId, UpsertEventDto eventDto) {
        UserEntity organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el organizador"));

        eventRepository.save(EventEntity.builder()
                .organizer(organizer)
                .title(eventDto.title())
                .description(eventDto.description())
                .startsAt(eventDto.startsAt())
                .build());
    }

    public void updateEvent(long eventId, long organizerId, UpsertEventDto eventDto) {
        EventEntity event = eventRepository.findByIdAndOrganizerId(eventId, organizerId, EventEntity.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el evento"));

        event.setTitle(eventDto.title());
        event.setDescription(eventDto.description());
        event.setStartsAt(eventDto.startsAt());

        eventRepository.save(event);
    }

    public void deleteEvent(long eventId, long organizerId) {
        eventRepository.findByIdAndOrganizerId(eventId, organizerId, EventEntity.class)
                .ifPresent(event -> {
                    Hibernate.initialize(event.getRegistrations());
                    if (!ObjectUtils.isEmpty(event.getRegistrations())) {
                        throw new RequestConflictException(
                                "No se puede eliminar el evento porque tiene inscripciones asociadas");
                    }
                    eventRepository.delete(event);
                });
    }
}
