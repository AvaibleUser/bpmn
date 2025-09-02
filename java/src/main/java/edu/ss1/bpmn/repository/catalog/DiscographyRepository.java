package edu.ss1.bpmn.repository.catalog;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;

@Repository
public interface DiscographyRepository
        extends JpaRepository<DiscographyEntity, Long>, JpaSpecificationExecutor<DiscographyEntity> {

    default <T> Page<T> findBy(Specification<DiscographyEntity> specification, Pageable pageable, Class<T> type) {
        return findBy(specification, query -> query.as(type).page(pageable));
    }

    <T> Optional<T> findById(Long id, Class<T> type);
}
