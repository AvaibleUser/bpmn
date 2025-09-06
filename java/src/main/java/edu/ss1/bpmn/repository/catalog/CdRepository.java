package edu.ss1.bpmn.repository.catalog;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.catalog.CdEntity;

@Repository
public interface CdRepository extends JpaRepository<CdEntity, Long> {

    <T> Set<T> findAllByDiscographyIdIn(Iterable<Long> ids, Class<T> type);

    void deleteByDiscographyId(Long discographyId);
}
