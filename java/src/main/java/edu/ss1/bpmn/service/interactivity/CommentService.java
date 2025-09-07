package edu.ss1.bpmn.service.interactivity;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.interactivity.comment.CommentDto;
import edu.ss1.bpmn.domain.dto.interactivity.comment.UpsertCommentDto;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.entity.interactivity.CommentEntity;
import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import edu.ss1.bpmn.repository.interactivity.CommentRepository;
import edu.ss1.bpmn.repository.interactivity.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final DiscographyRepository discographyRepository;

    public List<CommentDto> findCommentsDeletedByAdmin(long userId) {
        return commentRepository.findAllByUserIdAndDeletedTrue(userId, CommentDto.class);
    }

    public Page<CommentDto> findRootComments(long discographyId, Pageable pageable) {
        return commentRepository.findRootComments(discographyId, pageable,
                CommentDto.class);
    }

    public Page<CommentDto> findReplyComments(long discographyId, long replyToId, Pageable pageable) {
        return commentRepository.findReplyComments(discographyId, replyToId, pageable, CommentDto.class);
    }

    @Transactional
    public void addComment(long discographyId, long userId, UpsertCommentDto comment) {
        addCommentReply(discographyId, userId, 0, comment);
    }

    @Transactional
    public void addCommentReply(long discographyId, long userId, long commentId, UpsertCommentDto comment) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));

        DiscographyEntity discography = discographyRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        CommentEntity replied = null;
        if (commentId > 0) {
            replied = commentRepository.findById(commentId)
                    .orElseThrow(() -> new ValueNotFoundException("No se encontró el comentario"));
        }

        CommentEntity addedComment = CommentEntity.builder()
                .discography(discography)
                .user(user)
                .content(comment.content())
                .replyTo(replied)
                .build();

        commentRepository.save(addedComment);
    }

    @Transactional
    public void updateComment(long commentId, UpsertCommentDto comment) {
        CommentEntity commentEntity = commentRepository.findById(commentId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el comentario"));

        commentEntity.setContent(comment.content());

        commentRepository.save(commentEntity);
    }

    @Transactional
    public void deleteCommentByAdmin(long commentId) {
        commentRepository.findById(commentId)
                .ifPresent(c -> {
                    c.setDeleted(true);
                    c.setDeletedAt(Instant.now());
                    commentRepository.save(c);
                });
    }

    @Transactional
    public void deleteComment(long commentId) {
        commentRepository.findById(commentId)
                .ifPresent(c -> {
                    c.setDeletedAt(Instant.now());
                    commentRepository.save(c);
                });
    }
}
