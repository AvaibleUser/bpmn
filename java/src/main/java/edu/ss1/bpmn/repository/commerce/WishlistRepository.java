package edu.ss1.bpmn.repository.commerce;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ss1.bpmn.domain.entity.commerce.WishlistEntity;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistEntity, Long> {

    <T> Optional<T> findById(long id, Class<T> type);

    <T> Optional<T> findByUserIdAndDiscographyId(long userId, long discographyId, Class<T> type);

    <T> List<T> findByUserId(long userId, Class<T> type);

    <T> List<T> findByUserIdAndPaid(long userId, boolean paid, Class<T> type);

    <T> List<T> findByDiscographyId(long discographyId, Class<T> type);

    boolean existsByUserIdAndDiscographyId(long userId, long discographyId);

    void deleteByUserIdAndDiscographyId(long userId, long discographyId);
}
