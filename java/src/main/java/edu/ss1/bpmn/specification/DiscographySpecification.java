package edu.ss1.bpmn.specification;

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

    static Specification<DiscographyEntity> byStock() {
        return (root, query, builder) -> builder.or(
                builder.gt(root.get("stock"), 0),
                builder.isNull(root.get("stock")));
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
