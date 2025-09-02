package edu.ss1.bpmn.controller.catalog;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.ss1.bpmn.domain.dto.catalog.discography.AddDiscographyDto;
import edu.ss1.bpmn.domain.dto.catalog.discography.DiscographyDto;
import edu.ss1.bpmn.domain.dto.catalog.discography.FilterDiscographyDto;
import edu.ss1.bpmn.domain.dto.catalog.discography.UpdateDiscographyDto;
import edu.ss1.bpmn.service.catalog.DiscographyService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/discographies")
@RequiredArgsConstructor
public class DiscographyController {

    private final DiscographyService discographyService;

    @GetMapping
    public Page<DiscographyDto.Complete> findAllDiscographies(FilterDiscographyDto filter, Pageable pageable) {
        return discographyService.findAllDiscographies(filter, pageable);
    }

    @GetMapping("/{id}")
    public DiscographyDto findDiscographyById(@PathVariable long id) {
        return discographyService.findDiscographyById(id);
    }

    @RolesAllowed("ADMIN")
    @PostMapping
    @ResponseStatus(CREATED)
    public void createDiscography(@RequestBody @Valid AddDiscographyDto discographyDto) {
        discographyService.createDiscography(discographyDto);
    }

    @RolesAllowed("ADMIN")
    @PutMapping("/{id}")
    @ResponseStatus(NO_CONTENT)
    public void updateDiscography(@PathVariable long id, @RequestBody @Valid UpdateDiscographyDto discographyDto) {
        discographyService.updateDiscography(id, discographyDto);
    }

    @RolesAllowed("ADMIN")
    @PatchMapping("/{id}")
    @ResponseStatus(NO_CONTENT)
    public void addDiscographyImage(@PathVariable long id, @RequestPart("image") MultipartFile image) {
        discographyService.addDiscographyImage(id, image);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(NO_CONTENT)
    @RolesAllowed("ADMIN")
    public void deleteDiscography(@PathVariable long id) {
        discographyService.deleteDiscography(id);
    }
}
