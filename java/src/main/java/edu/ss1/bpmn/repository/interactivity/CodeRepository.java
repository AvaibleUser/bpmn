package edu.ss1.bpmn.repository.interactivity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.interactivity.CodeEntity;

@Repository
public interface CodeRepository extends JpaRepository<CodeEntity, Long> {

    <T> List<T> findByUserEmail(String email, Class<T> type);
}
