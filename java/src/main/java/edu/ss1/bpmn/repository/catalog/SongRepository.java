package edu.ss1.bpmn.repository.catalog;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.catalog.SongEntity;

@Repository
public interface SongRepository extends JpaRepository<SongEntity, Long> {

    <T> Optional<T> findById(Long id, Class<T> type);

    <T> List<T> findByDiscographyId(Long discographyId, Class<T> type);
}
