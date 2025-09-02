package edu.ss1.bpmn.repository.catalog;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.catalog.GenreEntity;

@Repository
public interface GenreRepository extends JpaRepository<GenreEntity, Long> {

    <T> List<T> findAllBy(Class<T> type);

    <T> Optional<T> findById(Long id, Class<T> type);

    <T> Optional<T> findByName(String name, Class<T> type);

    boolean existsByName(String name);
}
