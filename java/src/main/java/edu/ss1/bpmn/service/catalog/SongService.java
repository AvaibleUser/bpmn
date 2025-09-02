package edu.ss1.bpmn.service.catalog;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.catalog.song.AddSongDto;
import edu.ss1.bpmn.domain.dto.catalog.song.SongDto;
import edu.ss1.bpmn.domain.dto.catalog.song.UpdateSongDto;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.entity.catalog.SongEntity;
import edu.ss1.bpmn.domain.exception.BadRequestException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.domain.type.FormatType;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import edu.ss1.bpmn.repository.catalog.SongRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final DiscographyRepository discographyRepository;

    public List<SongDto> findSongsByDiscography(Long discographyId) {
        return songRepository.findByDiscographyId(discographyId, SongDto.class);
    }

    public SongDto findSongById(Long id) {
        return songRepository.findById(id, SongDto.class)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la canción"));
    }

    @Transactional
    public void createSong(long discographyId, AddSongDto songDto) {
        DiscographyEntity discography = discographyRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        if (discography.getFormat() != FormatType.CASSETTE && songDto.side() == null) {
            throw new BadRequestException("La canción debe tener un lado especificado");
        }

        SongEntity song = SongEntity.builder()
                .discography(discography)
                .name(songDto.name())
                .side(songDto.side())
                .url(songDto.url())
                .build();

        songRepository.save(song);
    }

    @Transactional
    public void updateSong(long id, UpdateSongDto songDto) {
        SongEntity song = songRepository.findById(id)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la canción"));

        song.setName(songDto.name());
        song.setSide(songDto.side());
        song.setUrl(songDto.url());

        songRepository.save(song);
    }

    @Transactional
    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }
}
