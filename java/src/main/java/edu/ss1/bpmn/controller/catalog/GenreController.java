package edu.ss1.bpmn.controller.catalog;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.domain.dto.catalog.genre.GenreDto;
import edu.ss1.bpmn.domain.dto.catalog.genre.UpsertGenreDto;
import edu.ss1.bpmn.service.catalog.GenreService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @GetMapping
    public List<GenreDto> findAllGenres() {
        return genreService.findAllGenres();
    }

    @GetMapping("/{id}")
    public GenreDto findGenreById(@PathVariable long id) {
        return genreService.findGenreById(id);
    }

    @RolesAllowed("ADMIN")
    @PostMapping
    @ResponseStatus(CREATED)
    public void createGenre(@RequestBody @Valid UpsertGenreDto genreDto) {
        genreService.createGenre(genreDto);
    }

    @RolesAllowed("ADMIN")
    @PutMapping("/{id}")
    @ResponseStatus(NO_CONTENT)
    public void updateGenre(@PathVariable long id, @RequestBody @Valid UpsertGenreDto genreDto) {
        genreService.updateGenre(id, genreDto);
    }

    @RolesAllowed("ADMIN")
    @DeleteMapping("/{id}")
    @ResponseStatus(NO_CONTENT)
    public void deleteGenre(@PathVariable long id) {
        genreService.deleteGenre(id);
    }
}
