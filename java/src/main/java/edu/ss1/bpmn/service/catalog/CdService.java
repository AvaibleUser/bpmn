package edu.ss1.bpmn.service.catalog;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.entity.catalog.CdEntity;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.exception.BadRequestException;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.domain.type.FormatType;
import edu.ss1.bpmn.repository.catalog.CdRepository;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CdService {

    private final CdRepository cdRepository;
    private final DiscographyRepository discographyRepository;

    @Transactional
    public void createCd(Long discographyId) {
        DiscographyEntity discography = discographyRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        if (discography.getFormat() != FormatType.CD) {
            throw new BadRequestException("La discografía debe ser de formato CD");
        }
        if (cdRepository.existsById(discographyId)) {
            throw new RequestConflictException("Ya existe un CD para esta discografía");
        }

        cdRepository.save(CdEntity.builder()
                .discography(discography)
                .build());
    }

    @Transactional
    public void updateCd(Long discographyId) {
        cdRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el CD"));
    }

    @Transactional
    public void deleteCd(Long discographyId) {
        cdRepository.deleteByDiscographyId(discographyId);
    }
}
