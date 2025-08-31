package edu.ss1.bpmn.specification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Component;

import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.type.FormatType;

@Component
public interface DiscographySpecification extends JpaSpecificationExecutor<DiscographyEntity> {

    default Specification<DiscographyEntity> byTitleWith(String title) {
        return (root, query, builder) -> builder.like(root.get("title"), "%" + title + "%");
    }

    default Specification<DiscographyEntity> byArtistWith(String artist) {
        return (root, query, builder) -> builder.like(root.get("artist"), "%" + artist + "%");
    }

    default Specification<DiscographyEntity> byGenreWithId(long genreId) {
        return (root, query, builder) -> builder.equal(root.join("genre").get("id"), genreId);
    }

    default Specification<DiscographyEntity> byYearBetween(int lower, int upper) {
        return (root, query, builder) -> builder.between(root.get("year"), lower, upper);
    }

    default Specification<DiscographyEntity> byPriceBetween(int lower, int upper) {
        return (root, query, builder) -> builder.between(root.get("price"), lower, upper);
    }

    default Specification<DiscographyEntity> byFormat(FormatType format) {
        return (root, query, builder) -> builder.equal(root.get("format"), format.name());
    }
}
