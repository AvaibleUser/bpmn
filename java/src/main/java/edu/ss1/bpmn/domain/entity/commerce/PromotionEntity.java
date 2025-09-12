package edu.ss1.bpmn.domain.entity.commerce;

import static jakarta.persistence.CascadeType.ALL;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PRIVATE;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import edu.ss1.bpmn.domain.entity.catalog.CdEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Entity(name = "promotions")
@Table(name = "promotions", schema = "commerce")
@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor(access = PRIVATE)
public class PromotionEntity {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @NonNull
    @Column(nullable = false)
    private String name;

    @NonNull
    @Column(nullable = false)
    private String description;

    @NonNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "group_type_id", nullable = false)
    private GroupingTypeEntity groupType;

    @NonNull
    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    private boolean active;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @ManyToMany(cascade = ALL)
    @JoinTable(name = "promoted_cds", schema = "commerce", joinColumns = @JoinColumn(name = "promotion_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "cd_id", referencedColumnName = "discography_id"))
    private Set<CdEntity> cds;
}
