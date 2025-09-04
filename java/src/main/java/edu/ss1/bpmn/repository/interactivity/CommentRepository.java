package edu.ss1.bpmn.repository.interactivity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.interactivity.CommentEntity;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    <T> Page<T> findAllByDiscographyIdAndDeletedFalseAndReplyToNull(long id, Pageable pageable, Class<T> type);

    <T> Page<T> findAllByDiscographyIdAndReplyToIdAndDeletedFalse(long id, long replyToId, Pageable pageable,
            Class<T> type);

    default <T> Page<T> findRootComments(long id, Pageable pageable, Class<T> type) {
        return findAllByDiscographyIdAndDeletedFalseAndReplyToNull(id, pageable, type);
    }

    default <T> Page<T> findReplyComments(long id, long replyToId, Pageable pageable, Class<T> type) {
        return findAllByDiscographyIdAndReplyToIdAndDeletedFalse(id, replyToId, pageable, type);
    }
}
