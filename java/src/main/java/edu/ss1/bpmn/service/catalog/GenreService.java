package edu.ss1.bpmn.service.catalog;

import java.util.List;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.catalog.genre.GenreDto;
import edu.ss1.bpmn.domain.dto.catalog.genre.UpsertGenreDto;
import edu.ss1.bpmn.domain.entity.catalog.GenreEntity;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.catalog.GenreRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GenreService {

    private final GenreRepository genreRepository;

    public List<GenreDto> findAllGenres() {
        return genreRepository.findAllBy(GenreDto.class);
    }

    public GenreDto findGenreById(long id) {
        return genreRepository.findById(id, GenreDto.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el género"));
    }

    @Transactional
    public void createGenre(UpsertGenreDto genreDto) {
        if (genreRepository.existsByName(genreDto.name())) {
            throw new RequestConflictException("Ya existe un género con ese nombre");
        }

        GenreEntity genre = GenreEntity.builder()
                .name(genreDto.name())
                .build();

        genreRepository.save(genre);
    }

    @Transactional
    public void updateGenre(long id, UpsertGenreDto genreDto) {
        GenreEntity genre = genreRepository.findById(id)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el género"));

        if (!genre.getName().equals(genreDto.name()) && genreRepository.existsByName(genreDto.name())) {
            throw new RequestConflictException("Ya existe un género con ese nombre");
        }

        genre.setName(genreDto.name());
        genreRepository.save(genre);
    }

    @Transactional
    public void deleteGenre(long id) {
        genreRepository.findById(id)
                .ifPresent(genre -> {
                    Hibernate.initialize(genre.getDiscographies());
                    if (genre.getDiscographies() != null && !genre.getDiscographies().isEmpty()) {
                        throw new RequestConflictException(
                                "No se puede eliminar el género porque tiene discografías asociadas");
                    }
                    genreRepository.delete(genre);
                });
    }
}
