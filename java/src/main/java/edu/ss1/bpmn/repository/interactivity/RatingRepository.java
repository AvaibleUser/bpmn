package edu.ss1.bpmn.repository.interactivity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.interactivity.RatingEntity;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Long> {

    <T> List<T> findAllByDiscographyIdAndDeletedFalse(long id, Class<T> type);
}
