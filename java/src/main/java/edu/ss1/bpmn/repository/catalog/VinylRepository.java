package edu.ss1.bpmn.repository.catalog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.catalog.VinylEntity;

@Repository
public interface VinylRepository extends JpaRepository<VinylEntity, Long> {

    List<VinylEntity> findBySize(Integer size);

    void deleteByDiscographyId(Long discographyId);
}
