package edu.ss1.bpmn.repository.commerce;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.commerce.OrderEntity;
import edu.ss1.bpmn.domain.type.StatusType;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    <T> Optional<T> findById(long id, Class<T> type);

    <T> Optional<T> findByIdAndUserId(long id, long userId, Class<T> type);

    <T> List<T> findByUserId(long userId, Class<T> type);

    <T> List<T> findByUserIdAndStatus(long userId, StatusType status, Class<T> type);
}
