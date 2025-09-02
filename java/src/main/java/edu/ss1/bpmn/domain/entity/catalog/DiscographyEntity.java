package edu.ss1.bpmn.domain.entity.catalog;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PRIVATE;

import java.math.BigDecimal;
import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import edu.ss1.bpmn.domain.type.FormatType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Entity(name = "discographies")
@Table(name = "discographies", schema = "catalog")
@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor(access = PRIVATE)
public class DiscographyEntity {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @NonNull
    @Column(nullable = false)
    private String title;

    @NonNull
    @Column(nullable = false)
    private String artist;

    private String imageUrl;

    @NonNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "genre_id", nullable = false)
    private GenreEntity genre;

    @NonNull
    @Column(nullable = false)
    private Integer year;

    @NonNull
    @Column(nullable = false)
    private BigDecimal price;

    private Integer stock;

    @NonNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FormatType format;

    private boolean visible;

    private Instant release;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    private Instant deletedAt;

    @OneToOne(mappedBy = "discography")
    private VinylEntity vinyl;

    @OneToOne(mappedBy = "discography")
    private CassetteEntity cassette;

    @OneToOne(mappedBy = "discography")
    private CdEntity cd;
}
