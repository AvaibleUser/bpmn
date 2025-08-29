package edu.ss1.bpmn.domain.entity.catalog;

import static lombok.AccessLevel.PRIVATE;

import edu.ss1.bpmn.domain.type.ConditionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Entity(name = "cassettes")
@Table(name = "cassettes", schema = "catalog")
@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(of = "discographyId")
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor(access = PRIVATE)
public class CassetteEntity {

    @Id
    private Long discographyId;

    @MapsId
    @NonNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "discography_id", nullable = false)
    private DiscographyEntity discography;

    @NonNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ConditionType condition;
}
