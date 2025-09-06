package edu.ss1.bpmn.service.commerce;

import java.util.List;

import org.springframework.stereotype.Service;

import edu.ss1.bpmn.domain.dto.commerce.group.GroupingTypeDto;
import edu.ss1.bpmn.repository.commerce.GroupingTypeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroupingTypeService {

    private final GroupingTypeRepository groupRepository;

    public List<GroupingTypeDto> findGroupingTypes() {
        return groupRepository.findAllBy(GroupingTypeDto.class);
    }
}
