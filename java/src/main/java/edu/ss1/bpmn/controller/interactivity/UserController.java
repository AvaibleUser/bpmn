package edu.ss1.bpmn.controller.interactivity;

import static org.springframework.http.HttpStatus.NO_CONTENT;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.domain.dto.user.UpdateUserRoleDto;
import edu.ss1.bpmn.service.interactivity.UserService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @RolesAllowed("ADMIN")
    @PatchMapping("/{userId}/role")
    @ResponseStatus(NO_CONTENT)
    public void changeRole(UpdateUserRoleDto user) {
        userService.changeRole(user);
    }
}
