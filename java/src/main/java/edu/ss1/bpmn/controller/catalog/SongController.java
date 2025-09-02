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

import edu.ss1.bpmn.domain.dto.catalog.song.AddSongDto;
import edu.ss1.bpmn.domain.dto.catalog.song.SongDto;
import edu.ss1.bpmn.domain.dto.catalog.song.UpdateSongDto;
import edu.ss1.bpmn.service.catalog.SongService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @GetMapping("/discographies/{discographyId}/songs")
    public List<SongDto> findSongsByDiscography(@PathVariable Long discographyId) {
        return songService.findSongsByDiscography(discographyId);
    }

    @GetMapping("/songs/{id}")
    public SongDto findSongById(@PathVariable Long id) {
        return songService.findSongById(id);
    }

    @RolesAllowed("ADMIN")
    @PostMapping("/discographies/{discographyId}/songs")
    @ResponseStatus(CREATED)
    public void createSong(@PathVariable Long discographyId, @RequestBody @Valid AddSongDto songDto) {
        songService.createSong(discographyId, songDto);
    }

    @PutMapping("/songs/{id}")
    @ResponseStatus(NO_CONTENT)
    @RolesAllowed("ADMIN")
    public void updateSong(@PathVariable Long id, @RequestBody @Valid UpdateSongDto songDto) {
        songService.updateSong(id, songDto);
    }

    @RolesAllowed("ADMIN")
    @DeleteMapping("/songs/{id}")
    @ResponseStatus(NO_CONTENT)
    public void deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
    }
}
