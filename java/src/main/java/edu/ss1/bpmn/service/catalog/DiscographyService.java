package edu.ss1.bpmn.service.catalog;

import static edu.ss1.bpmn.specification.DiscographySpecification.byArtistWith;
import static edu.ss1.bpmn.specification.DiscographySpecification.byFormat;
import static edu.ss1.bpmn.specification.DiscographySpecification.byGenreWithId;
import static edu.ss1.bpmn.specification.DiscographySpecification.byNonDeleted;
import static edu.ss1.bpmn.specification.DiscographySpecification.byPriceGreaterThan;
import static edu.ss1.bpmn.specification.DiscographySpecification.byPriceLessThan;
import static edu.ss1.bpmn.specification.DiscographySpecification.byStock;
import static edu.ss1.bpmn.specification.DiscographySpecification.byTitleWith;
import static edu.ss1.bpmn.specification.DiscographySpecification.byVisible;
import static edu.ss1.bpmn.specification.DiscographySpecification.byYear;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import edu.ss1.bpmn.domain.dto.catalog.discography.AddDiscographyDto;
import edu.ss1.bpmn.domain.dto.catalog.discography.DiscographyDto;
import edu.ss1.bpmn.domain.dto.catalog.discography.FilterDiscographyDto;
import edu.ss1.bpmn.domain.dto.catalog.discography.UpdateDiscographyDto;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.entity.catalog.GenreEntity;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import edu.ss1.bpmn.repository.catalog.GenreRepository;
import edu.ss1.bpmn.service.util.S3Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiscographyService {

    private final DiscographyRepository discographyRepository;
    private final GenreRepository genreRepository;
    private final S3Service s3Service;
    private final VinylService vinylService;
    private final CassetteService cassetteService;
    private final CdService cdService;

    public Page<DiscographyDto> findAllDiscographies(FilterDiscographyDto filter, Pageable pageable) {
        Specification<DiscographyEntity> specification = byVisible()
                .and(byNonDeleted())
                .and(byStock())
                .and(byTitleWith(filter.title()))
                .and(byArtistWith(filter.artist()))
                .and(byGenreWithId(filter.genreId()))
                .and(byYear(filter.year()))
                .and(byPriceGreaterThan(filter.priceLower()))
                .and(byPriceLessThan(filter.priceUpper()))
                .and(byFormat(filter.format()));

        return discographyRepository.findBy(specification, pageable, DiscographyDto.class);

    }

    public DiscographyDto findDiscographyById(Long id) {
        return discographyRepository.findById(id, DiscographyDto.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));
    }

    @Transactional
    public void createDiscography(AddDiscographyDto discographyDto) {
        GenreEntity genre = genreRepository.findById(discographyDto.genreId())
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el género"));

        DiscographyEntity discography = DiscographyEntity.builder()
                .title(discographyDto.title())
                .artist(discographyDto.artist())
                .imageUrl(discographyDto.imageUrl())
                .genre(genre)
                .year(discographyDto.year())
                .price(discographyDto.price())
                .stock(discographyDto.stock())
                .format(discographyDto.format())
                .visible(discographyDto.visible())
                .release(discographyDto.release())
                .build();

        discographyRepository.saveAndFlush(discography);

        switch (discographyDto.format()) {
            case CASSETTE -> cassetteService.createCassette(discography.getId(), discographyDto.cassette());
            case VINYL -> vinylService.createVinyl(discography.getId(), discographyDto.vinyl());
            case CD -> cdService.createCd(discography.getId());
        }
    }

    @Transactional
    public void updateDiscography(Long id, UpdateDiscographyDto discographyDto) {
        DiscographyEntity discography = discographyRepository.findById(id)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        if (discographyDto.genreId() != null) {
            GenreEntity genre = genreRepository.findById(discographyDto.genreId())
                    .orElseThrow(() -> new ValueNotFoundException("No se encontró el género"));

            discography.setGenre(genre);
        }

        discography.setTitle(discographyDto.title());
        discography.setArtist(discographyDto.artist());
        discography.setImageUrl(discographyDto.imageUrl());
        discography.setYear(discographyDto.year());
        discography.setPrice(discographyDto.price());
        discography.setStock(discographyDto.stock());
        discography.setFormat(discographyDto.format());
        discography.setVisible(discographyDto.visible());
        discography.setRelease(discographyDto.release());

        discographyRepository.save(discography);

        if (discographyDto.format() != discography.getFormat()) {
            switch (discography.getFormat()) {
                case CASSETTE -> cassetteService.deleteCassette(discography.getId());
                case VINYL -> vinylService.deleteVinyl(discography.getId());
                case CD -> cdService.deleteCd(discography.getId());
            }
            switch (discographyDto.format()) {
                case CASSETTE -> cassetteService.createCassette(discography.getId(), discographyDto.cassette());
                case VINYL -> vinylService.createVinyl(discography.getId(), discographyDto.vinyl());
                case CD -> cdService.createCd(discography.getId());
            }
        } else {
            switch (discographyDto.format()) {
                case CASSETTE -> cassetteService.updateCassette(discography.getId(), discographyDto.cassette());
                case VINYL -> vinylService.updateVinyl(discography.getId(), discographyDto.vinyl());
                case CD -> cdService.updateCd(discography.getId());
            }
        }
    }

    @Transactional
    public void addDiscographyImage(Long id, MultipartFile image) {
        DiscographyEntity discography = discographyRepository.findById(id)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        String path = s3Service.store("discography_" + id, image);
        discography.setImageUrl(path);
        discographyRepository.save(discography);
    }

    @Transactional
    public void deleteDiscography(Long id) {
        discographyRepository.findById(id)
                .ifPresent((discography) -> {
                    discography.setDeletedAt(Instant.now());
                    discography.setVisible(false);
                    discographyRepository.save(discography);
                });
    }
}
