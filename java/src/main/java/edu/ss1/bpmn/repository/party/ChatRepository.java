package edu.ss1.bpmn.repository.party;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.party.ChatEntity;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Long> {

    <T> List<T> findByRegistrationEventIdOrderBySentAt(Long eventId, Class<T> type);

    <T> List<T> findByIdGreaterThanAndRegistrationEventIdOrderBySentAt(Long id, Long eventId, Class<T> type);

    void deleteByIdAndRegistrationEventIdAndRegistrationUserId(Long id, Long eventId, Long userId);

    default <T> List<T> findAllEventMessages(Long eventId, Class<T> type) {
        return findByRegistrationEventIdOrderBySentAt(eventId, type);
    }

    default <T> List<T> findNewMessagesAfter(Long id, Long eventId, Class<T> type) {
        return findByIdGreaterThanAndRegistrationEventIdOrderBySentAt(id, eventId, type);
    }

    default void deleteMessage(Long id, Long eventId, Long userId) {
        deleteByIdAndRegistrationEventIdAndRegistrationUserId(id, eventId, userId);
    }
}
