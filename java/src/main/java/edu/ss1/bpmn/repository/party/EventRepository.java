package edu.ss1.bpmn.repository.party;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.party.EventEntity;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {

    <T> Optional<T> findByIdAndOrganizerId(Long id, Long organizerId, Class<T> type);

    <T> Optional<T> findByIdAndStartsAtAfter(Long id, Instant startsAt, Class<T> type);

    <T> List<T> findByStartsAtAfter(Instant startsAt, Class<T> type);

    <T> List<T> findByOrganizerId(Long id, Class<T> type);

    default <T> Optional<T> findUpcomingEvent(Long id, Class<T> type) {
        return findByIdAndStartsAtAfter(id, Instant.now(), type);
    }

    default <T> List<T> findUpcomingEvents(Class<T> type) {
        return findByStartsAtAfter(Instant.now(), type);
    }
}
