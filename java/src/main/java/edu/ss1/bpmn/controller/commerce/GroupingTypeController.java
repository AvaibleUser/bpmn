package edu.ss1.bpmn.controller.commerce;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.domain.dto.commerce.group.GroupingTypeDto;
import edu.ss1.bpmn.service.commerce.GroupingTypeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupingTypeController {

    private final GroupingTypeService groupingTypesService;

    @GetMapping
    public List<GroupingTypeDto> findGroupingTypes() {
        return groupingTypesService.findGroupingTypes();
    }
}
