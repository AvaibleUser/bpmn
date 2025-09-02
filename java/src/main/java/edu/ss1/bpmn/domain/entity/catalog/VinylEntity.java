package edu.ss1.bpmn.domain.entity.catalog;

import static lombok.AccessLevel.PRIVATE;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Entity(name = "vinyls")
@Table(name = "vinyls", schema = "catalog")
@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(of = "discographyId")
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor(access = PRIVATE)
public class VinylEntity {

    @Id
    private Long discographyId;

    @MapsId
    @NonNull
    @OneToOne(optional = false)
    @JoinColumn(name = "discography_id", nullable = false)
    private DiscographyEntity discography;

    @NonNull
    @Column(nullable = false)
    private Integer size;

    private String specialEdition;
}
