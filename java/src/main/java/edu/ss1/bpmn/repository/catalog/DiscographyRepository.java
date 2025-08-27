package edu.ss1.bpmn.repository.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;

@Repository
public interface DiscographyRepository extends JpaRepository<DiscographyEntity, Long> {

}
