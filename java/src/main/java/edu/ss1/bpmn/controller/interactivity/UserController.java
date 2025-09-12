package edu.ss1.bpmn.controller.interactivity;

import static org.springframework.http.HttpStatus.NO_CONTENT;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.domain.dto.interactivity.user.UpdateUserRoleDto;
import edu.ss1.bpmn.service.interactivity.CommentService;
import edu.ss1.bpmn.service.interactivity.UserService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CommentService commentService;

    @RolesAllowed("ADMIN")
    @PatchMapping("/{userId}/role")
    @ResponseStatus(NO_CONTENT)
    public void changeRole(@PathVariable long userId, @RequestBody @Valid UpdateUserRoleDto user) {
        userService.changeRole(userId, user);
    }

    @RolesAllowed("ADMIN")
    @PatchMapping("/{userId}/active")
    @ResponseStatus(NO_CONTENT)
    public void changePassword(@PathVariable long userId) {
        userService.changeActive(userId);
    }

    @RolesAllowed("ADMIN")
    @PatchMapping("/{userId}/comments/{commentId}")
    @ResponseStatus(NO_CONTENT)
    public void changeBanned(@PathVariable long userId, @PathVariable long commentId) {
        commentService.deleteCommentByAdmin(commentId);
        if (commentService.findCommentsDeletedByAdmin(userId).size() >= 3) {
            userService.changeBanned(userId);
        }
    }
}
