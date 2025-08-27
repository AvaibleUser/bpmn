package edu.ss1.bpmn.repository.interactivity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<?> findUnknownById(long id, Class<?> type);

    <U> Optional<U> findById(long id, Class<U> type);

    <U> Optional<U> findByEmail(String email, Class<U> type);

}
