package edu.ss1.bpmn.service.party;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import edu.ss1.bpmn.domain.dto.party.registration.RegistrationDto;
import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;
import edu.ss1.bpmn.domain.entity.party.EventEntity;
import edu.ss1.bpmn.domain.entity.party.RegistrationEntity;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.interactivity.UserRepository;
import edu.ss1.bpmn.repository.party.EventRepository;
import edu.ss1.bpmn.repository.party.RegistrationRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public List<RegistrationDto> findUserUpcomingEvents(long userId) {
        return registrationRepository.findUserUpcomingEvents(userId, RegistrationDto.class);
    }

    public List<RegistrationDto> findByEventId(long eventId) {
        return registrationRepository.findByEventId(eventId, RegistrationDto.class);
    }

    public List<RegistrationDto> findByUserId(long userId) {
        return registrationRepository.findByUserId(userId, RegistrationDto.class);
    }

    public void createRegistration(long userId, long eventId) {
        if (registrationRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new RequestConflictException("El usuario ya se encuentra registrado en el evento");
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el evento"));

        if (event.getFinishedAt().isBefore(Instant.now())) {
            throw new RequestConflictException("El evento ya ha terminado");
        }

        registrationRepository.save(RegistrationEntity.builder()
                .user(user)
                .event(event)
                .build());
    }

    public void deleteRegistration(long userId, long eventId) {
        registrationRepository.findByUserIdAndEventId(userId, eventId, RegistrationEntity.class)
                .ifPresent(registration -> {
                    if (registration.getEvent().getStartsAt().isBefore(Instant.now())) {
                        throw new RequestConflictException(
                                "No se puede eliminar la inscripción porque el evento ya ha comenzado o terminado");
                    }
                    registrationRepository.delete(registration);
                });
    }
}
