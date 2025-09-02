package edu.ss1.bpmn.service.catalog;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.catalog.cassette.AddCassetteDto;
import edu.ss1.bpmn.domain.entity.catalog.CassetteEntity;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.exception.BadRequestException;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.domain.type.FormatType;
import edu.ss1.bpmn.repository.catalog.CassetteRepository;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CassetteService {

    private final CassetteRepository cassetteRepository;
    private final DiscographyRepository discographyRepository;

    @Transactional
    public void createCassette(long discographyId, AddCassetteDto cassetteDto) {
        DiscographyEntity discography = discographyRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        if (discography.getFormat() != FormatType.CASSETTE) {
            throw new BadRequestException("La discografía debe ser de formato CASSETTE");
        }
        if (cassetteRepository.existsById(discographyId)) {
            throw new RequestConflictException("Ya existe un cassette para esta discografía");
        }

        cassetteRepository.save(CassetteEntity.builder()
                .discography(discography)
                .condition(cassetteDto.condition())
                .build());
    }

    @Transactional
    public void updateCassette(long discographyId, AddCassetteDto cassetteDto) {
        CassetteEntity cassette = cassetteRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el cassette"));

        cassette.setCondition(cassetteDto.condition());

        cassetteRepository.save(cassette);
    }

    @Transactional
    public void deleteCassette(Long discographyId) {
        cassetteRepository.deleteByDiscographyId(discographyId);
    }
}
