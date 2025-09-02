package edu.ss1.bpmn.repository.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.catalog.CassetteEntity;

@Repository
public interface CassetteRepository extends JpaRepository<CassetteEntity, Long> {

    void deleteByDiscographyId(Long discographyId);
}
