package edu.ss1.bpmn.controller.party;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.party.chat.AddChatDto;
import edu.ss1.bpmn.domain.dto.party.chat.ChatDto;
import edu.ss1.bpmn.domain.exception.TimedOutException;
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
    public List<ChatDto> findAllEventMessages(@PathVariable long eventId) {
        return chatService.findAllEventMessages(eventId);
    }

    @GetMapping(params = "lastMessageId")
    public DeferredResult<List<ChatDto>> findNewMessagesAfter(@PathVariable long eventId,
            @RequestParam long lastMessageId) {
        long timeout = TimeUnit.SECONDS.toMillis(10);
        DeferredResult<List<ChatDto>> result = new DeferredResult<>(timeout);

        CompletableFuture.runAsync(() -> {
            while (true) {
                List<ChatDto> messages = chatService.findNewMessagesAfter(lastMessageId, eventId);
                if (ObjectUtils.isNotEmpty(messages)) {
                    result.setResult(messages);
                    break;
                }
                try {
                    TimeUnit.MILLISECONDS.sleep(100);
                } catch (InterruptedException e) {
                }
            }
        });
        result.onTimeout(
                () -> result.setErrorResult(new TimedOutException("No se encontraron nuevos mensajes en el chat")));

        return result;
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
