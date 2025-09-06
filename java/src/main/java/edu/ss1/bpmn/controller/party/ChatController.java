package edu.ss1.bpmn.controller.party;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.party.chat.AddChatDto;
import edu.ss1.bpmn.domain.dto.party.chat.ChatDto;
import edu.ss1.bpmn.service.party.ChatService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RolesAllowed({ "CLIENT", "ADMIN" })
@RequestMapping("/events/{eventId}/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public List<ChatDto> findAllEventMessages(@PathVariable long eventId,
            @RequestParam(required = false) Long lastMessageId) {
        if (lastMessageId == null) {
            return chatService.findAllEventMessages(eventId);
        }
        return chatService.findNewMessagesAfter(lastMessageId, eventId);
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public void createMessage(@CurrentUserId long userId, @PathVariable long eventId, @Valid AddChatDto chat) {
        chatService.createMessage(userId, eventId, chat);
    }

    @DeleteMapping("/{messageId}")
    @ResponseStatus(NO_CONTENT)
    public void deleteMessage(@CurrentUserId long userId, @PathVariable long eventId, @PathVariable long messageId) {
        chatService.deleteMessage(messageId, eventId, userId);
    }
}
