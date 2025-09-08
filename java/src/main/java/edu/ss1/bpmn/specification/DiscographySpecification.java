package edu.ss1.bpmn.specification;

import static jakarta.persistence.criteria.JoinType.LEFT;

import java.time.Instant;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.type.FormatType;

@Component
public interface DiscographySpecification {

    static Specification<DiscographyEntity> byTitleWith(String title) {
        if (title == null) {
            return Specification.unrestricted();
        }
        return (root, query, builder) -> builder.like(root.get("title"), "%" + title + "%");
    }

    static Specification<DiscographyEntity> byArtistWith(String artist) {
        if (artist == null) {
            return Specification.unrestricted();
        }
        return (root, query, builder) -> builder.like(root.get("artist"), "%" + artist + "%");
    }

    static Specification<DiscographyEntity> byGenreWithId(Long genreId) {
        if (genreId == null) {
            return Specification.unrestricted();
        }
        return (root, query, builder) -> builder.equal(root.join("genre").get("id"), genreId);
    }

    static Specification<DiscographyEntity> byYear(Integer year) {
        if (year == null) {
            return Specification.unrestricted();
        }
        return (root, query, builder) -> builder.equal(root.get("year"), year);
    }

    static Specification<DiscographyEntity> byPriceGreaterThan(Integer price) {
        if (price == null) {
            return Specification.unrestricted();
        }
        return (root, query, builder) -> builder.gt(root.get("price"), price);
    }

    static Specification<DiscographyEntity> byPriceLessThan(Integer price) {
        if (price == null) {
            return Specification.unrestricted();
        }
        return (root, query, builder) -> builder.lt(root.get("price"), price);
    }

    static Specification<DiscographyEntity> byStock(Integer stock) {
        if (stock == null) {
            return Specification.unrestricted();
        }
        return (root, query, builder) -> builder.and(
                builder.or(
                        root.get("release").isNull(),
                        builder.lessThan(root.get("release"), Instant.now())),
                builder.or(
                        builder.greaterThanOrEqualTo(root.get("stock"), stock),
                        root.get("stock").isNull()));
    }

    static Specification<DiscographyEntity> orderByBestSellers(Boolean bestSeller) {
        if (bestSeller == null) {
            return Specification.unrestricted();
        }
        return (root, query, builder) -> {
            var id = root.get("id");
            var genre = root.join("genre").get("id");
            var cassette = root.join("cassette", LEFT).get("discographyId");
            var vinyl = root.join("vinyl", LEFT).get("discographyId");
            var cd = root.join("cd", LEFT).get("discographyId");

            var itemsJoin = root.join("items", LEFT);
            var orderJoin = itemsJoin.join("order", LEFT);
            itemsJoin.on(builder.notEqual(orderJoin.get("status"), "CART"));
            var soldQuantity = builder.sum(itemsJoin.get("quantity"));
            soldQuantity = builder.coalesce(soldQuantity, 0);

            return query
                    .groupBy(id, genre, cassette, vinyl, cd)
                    .orderBy(bestSeller ? builder.desc(soldQuantity) : builder.asc(soldQuantity))
                    .getRestriction();
        };
    }

    static Specification<DiscographyEntity> byVisible() {
        return (root, query, builder) -> builder.isTrue(root.get("visible"));
    }

    static Specification<DiscographyEntity> byFormat(FormatType format) {
        if (format == null) {
            return Specification.unrestricted();
        }
        return (root, query, builder) -> builder.equal(root.get("format"), format.name());
    }

    static Specification<DiscographyEntity> byReleased(Boolean released) {
        if (released == null) {
            return Specification.unrestricted();
        }
        return (root, query, builder) -> released
                ? builder.or(
                        builder.isNull(root.get("release")),
                        builder.gt(root.get("release"), System.currentTimeMillis()))
                : builder.and(
                        builder.isNotNull(root.get("release")),
                        builder.lt(root.get("release"), System.currentTimeMillis()));
    }

    static Specification<DiscographyEntity> byNonDeleted() {
        return (root, query, builder) -> builder.isNull(root.get("deletedAt"));
    }
}
