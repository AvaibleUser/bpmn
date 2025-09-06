package edu.ss1.bpmn.repository.party;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.party.RegistrationEntity;

@Repository
public interface RegistrationRepository extends JpaRepository<RegistrationEntity, Long> {

    <T> Optional<T> findByUserIdAndEventId(Long userId, Long eventId, Class<T> type);

    <T> List<T> findByEventId(Long eventId, Class<T> type);

    <T> List<T> findByUserId(Long userId, Class<T> type);

    <T> List<T> findByUserIdAndEventStartsAtAfter(Long userId, Instant startsAt, Class<T> type);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    void deleteByUserIdAndEventId(Long userId, Long eventId);

    default <T> List<T> findUserUpcomingEvents(Long userId, Class<T> type) {
        return findByUserIdAndEventStartsAtAfter(userId, Instant.now(), type);
    }
}
