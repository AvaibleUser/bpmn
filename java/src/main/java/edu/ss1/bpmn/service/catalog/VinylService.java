package edu.ss1.bpmn.service.catalog;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.catalog.vinyl.AddVinylDto;
import edu.ss1.bpmn.domain.entity.catalog.DiscographyEntity;
import edu.ss1.bpmn.domain.entity.catalog.VinylEntity;
import edu.ss1.bpmn.domain.exception.BadRequestException;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.domain.type.FormatType;
import edu.ss1.bpmn.repository.catalog.DiscographyRepository;
import edu.ss1.bpmn.repository.catalog.VinylRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VinylService {

    private final VinylRepository vinylRepository;
    private final DiscographyRepository discographyRepository;

    private void validateVinylSize(Integer size) {
        if (size != 7 && size != 10 && size != 12) {
            throw new BadRequestException("El tamaño del vinilo debe ser 7, 10 o 12 pulgadas");
        }
    }

    @Transactional
    public void createVinyl(Long discographyId, AddVinylDto vinylDto) {
        DiscographyEntity discography = discographyRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró la discografía"));

        if (discography.getFormat() != FormatType.VINYL) {
            throw new BadRequestException("La discografía debe ser de formato VINYL");
        }
        if (vinylRepository.existsById(discographyId)) {
            throw new RequestConflictException("Ya existe un vinilo para esta discografía");
        }

        validateVinylSize(vinylDto.size());

        vinylRepository.save(VinylEntity.builder()
                .discography(discography)
                .size(vinylDto.size())
                .specialEdition(vinylDto.specialEdition())
                .build());
    }

    @Transactional
    public void updateVinyl(Long discographyId, AddVinylDto vinylDto) {
        VinylEntity vinyl = vinylRepository.findById(discographyId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el vinilo"));

        if (vinylDto.size() != null) {
            validateVinylSize(vinylDto.size());
        }

        vinyl.setSize(vinylDto.size());
        vinyl.setSpecialEdition(vinylDto.specialEdition());

        vinylRepository.save(vinyl);
    }

    @Transactional
    public void deleteVinyl(Long discographyId) {
        vinylRepository.deleteByDiscographyId(discographyId);
    }
}
