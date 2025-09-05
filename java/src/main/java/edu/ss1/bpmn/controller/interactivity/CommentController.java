package edu.ss1.bpmn.controller.interactivity;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import edu.ss1.bpmn.domain.dto.interactivity.comment.CommentDto;
import edu.ss1.bpmn.domain.dto.interactivity.comment.UpsertCommentDto;
import edu.ss1.bpmn.service.interactivity.CommentService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/discographies/{discographyId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public Page<CommentDto> findAllComments(@PathVariable long discographyId, Pageable pageable) {
        return commentService.findRootComments(discographyId, pageable);
    }

    @GetMapping("/{commentId}")
    public Page<CommentDto> findAllReplies(@PathVariable long discographyId, @PathVariable long commentId,
            Pageable pageable) {
        return commentService.findReplyComments(discographyId, commentId, pageable);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @PostMapping
    @ResponseStatus(CREATED)
    public void addComment(@PathVariable long discographyId, @CurrentUserId long userId,
            @RequestBody @Valid UpsertCommentDto comment) {
        commentService.addComment(discographyId, userId, comment);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @PostMapping("/{commentId}")
    @ResponseStatus(CREATED)
    public void addCommentReply(@PathVariable long discographyId, @CurrentUserId long userId, long commentId,
            UpsertCommentDto comment) {
        commentService.addCommentReply(discographyId, userId, commentId, comment);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @PutMapping("/{commentId}")
    @ResponseStatus(NO_CONTENT)
    public void updateComment(@PathVariable long commentId, @RequestBody @Valid UpsertCommentDto comment) {
        commentService.updateComment(commentId, comment);
    }

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @DeleteMapping("/{commentId}")
    @ResponseStatus(NO_CONTENT)
    public void deleteComment(@PathVariable long commentId) {
        commentService.deleteComment(commentId);
    }
}
