package edu.ss1.bpmn.repository.catalog;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.dto.interactivity.rating.RatingDto;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;

@Repository
public interface DiscographyRepository
        extends JpaRepository<DiscographyEntity, Long>, JpaSpecificationExecutor<DiscographyEntity> {

    @Query("""
            SELECT NEW edu.ss1.bpmn.domain.dto.interactivity.rating.RatingDto(d.id, CAST(ROUND(AVG(r.rating)) AS Integer))
            FROM discographies d
            LEFT JOIN d.ratings r
            WHERE d.id in (:ids)
            GROUP BY d.id
            """)
    List<RatingDto> findRatings(@Param("ids") List<Long> ids);

    default <T> Page<T> findBy(Specification<DiscographyEntity> specification, Pageable pageable, Class<T> type) {
        return findBy(specification, query -> query.as(type).page(pageable));
    }

    <T> Optional<T> findById(Long id, Class<T> type);

    <T> Set<T> findByCdPromotionsId(Long id, Class<T> type);
}
