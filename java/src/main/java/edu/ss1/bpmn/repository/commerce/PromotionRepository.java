package edu.ss1.bpmn.repository.commerce;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.commerce.PromotionEntity;

@Repository
public interface PromotionRepository extends JpaRepository<PromotionEntity, Long> {

    <T> Optional<T> findByIdAndActiveTrue(long id, Class<T> type);

    <T> Optional<T> findByIdAndGroupTypeIdAndActiveTrue(long id, long groupId, Class<T> type);

    <T> Optional<T> findByIdAndActiveTrueAndStartDateLessThanEqualAndEndDateGreaterThanEqual(long id,
            LocalDate startDate, LocalDate endDate, Class<T> type);

    <T> Page<T> findAllByActiveTrueAndStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate startDate,
            LocalDate endDate, Class<T> type, Pageable pageable);

    <T> List<T> findByCdsDiscographyIdAndActiveTrue(long discographyId, Class<T> type);

    default <T> Optional<T> findByIdAndAvailable(long id, Class<T> type) {
        return findByIdAndActiveTrueAndStartDateLessThanEqualAndEndDateGreaterThanEqual(id, LocalDate.now(),
                LocalDate.now(), type);
    }

    default <T> Page<T> findByAvailable(Class<T> type, Pageable pageable) {
        return findAllByActiveTrueAndStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate.now(), LocalDate.now(),
                type, pageable);
    }
}
