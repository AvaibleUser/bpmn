package edu.ss1.bpmn.repository.user;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.user.CodeEntity;

@Repository
public interface CodeRepository extends JpaRepository<CodeEntity, Long> {

    <T> List<T> findByUserEmail(String email, Class<T> type);
}
