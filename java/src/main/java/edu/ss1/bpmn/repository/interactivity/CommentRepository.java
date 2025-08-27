package edu.ss1.bpmn.repository.interactivity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.interactivity.CommentEntity;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    <T> List<T> findAllByDiscographyIdAndDeletedFalse(long id, Class<T> type);
}
