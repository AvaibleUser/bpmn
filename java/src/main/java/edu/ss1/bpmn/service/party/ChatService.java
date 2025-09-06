package edu.ss1.bpmn.service.party;

import java.util.List;

import org.springframework.stereotype.Service;

import edu.ss1.bpmn.domain.dto.party.chat.AddChatDto;
import edu.ss1.bpmn.domain.dto.party.chat.ChatDto;
import edu.ss1.bpmn.domain.entity.party.ChatEntity;
import edu.ss1.bpmn.domain.entity.party.RegistrationEntity;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.party.ChatRepository;
import edu.ss1.bpmn.repository.party.RegistrationRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final RegistrationRepository registrationRepository;

    public List<ChatDto> findAllEventMessages(long eventId) {
        return chatRepository.findAllEventMessages(eventId, ChatDto.class);
    }

    public List<ChatDto> findNewMessagesAfter(long id, long eventId) {
        return chatRepository.findNewMessagesAfter(id, eventId, ChatDto.class);
    }

    public void createMessage(long userId, long eventId, AddChatDto chat) {
        RegistrationEntity registration = registrationRepository
                .findByUserIdAndEventId(userId, eventId, RegistrationEntity.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la inscripción al evento"));

        chatRepository.save(ChatEntity.builder()
                .registration(registration)
                .content(chat.content())
                .build());
    }

    public void deleteMessage(long id, long eventId, long userId) {
        chatRepository.deleteMessage(id, eventId, userId);
    }
}
