package edu.ss1.bpmn.controller.interactivity;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.annotation.CurrentUserId;
import edu.ss1.bpmn.domain.dto.comment.CommentDto;
import edu.ss1.bpmn.domain.dto.comment.UpsertCommentDto;
import edu.ss1.bpmn.service.interactivity.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/discographies/{discographyId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public List<CommentDto> findAllComments(long discographyId) {
        return commentService.findAllComments(discographyId);
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public void addComment(long discographyId, @CurrentUserId long userId,
            @RequestBody @Valid UpsertCommentDto comment) {
        commentService.addComment(discographyId, userId, comment);
    }

    @PostMapping("/{commentId}")
    @ResponseStatus(CREATED)
    public void addCommentReply(long discographyId, @CurrentUserId long userId, long commentId,
            UpsertCommentDto comment) {
        commentService.addCommentReply(discographyId, userId, commentId, comment);
    }

    @PutMapping("/{commentId}")
    @ResponseStatus(NO_CONTENT)
    public void updateComment(long commentId, @RequestBody @Valid UpsertCommentDto comment) {
        commentService.updateComment(commentId, comment);
    }

    @DeleteMapping("/{commentId}")
    @ResponseStatus(NO_CONTENT)
    public void deleteComment(long commentId) {
        commentService.deleteComment(commentId);
    }
}
