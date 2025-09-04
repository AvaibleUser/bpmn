package edu.ss1.bpmn.repository.interactivity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.interactivity.RatingEntity;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Long> {

    <T> Optional<T> findByUserIdAndDiscographyId(long userId, long discographyId, Class<T> type);

    <T> List<T> findAllByDiscographyIdAndDeletedFalse(long id, Class<T> type);

    boolean existsByUserIdAndDiscographyId(long userId, long discographyId);
}
