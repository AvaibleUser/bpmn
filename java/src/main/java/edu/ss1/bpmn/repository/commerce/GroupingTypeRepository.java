package edu.ss1.bpmn.repository.commerce;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.commerce.GroupingTypeEntity;

@Repository
public interface GroupingTypeRepository extends JpaRepository<GroupingTypeEntity, Long> {

    <T> List<T> findAllBy(Class<T> type);

    <T> Optional<T> findById(long id, Class<T> type);
}
