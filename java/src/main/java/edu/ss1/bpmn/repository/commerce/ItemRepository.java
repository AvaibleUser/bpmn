package edu.ss1.bpmn.repository.commerce;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.commerce.ItemEntity;

@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, Long> {

    <T> Optional<T> findById(long id, Class<T> type);

    <T> Optional<T> findByIdAndOrderUserIdAndOrderId(long id, long userId, long orderId, Class<T> type);

    <T> List<T> findByOrderUserIdAndOrderId(long userId, long orderId, Class<T> type);

    boolean existsByOrderIdAndDiscographyId(long userId, long discographyId);

    boolean existsByOrderIdAndPromotionId(long userId, long promotionId);
}
