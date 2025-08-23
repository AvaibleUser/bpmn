package edu.ss1.bpmn.controller.user;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.security.authentication.UsernamePasswordAuthenticationToken.unauthenticated;

import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.domain.dto.user.AddUserDto;
import edu.ss1.bpmn.domain.dto.user.AuthUserDto;
import edu.ss1.bpmn.domain.dto.user.ConfirmUserDto;
import edu.ss1.bpmn.domain.dto.user.TokenDto;
import edu.ss1.bpmn.domain.dto.user.UserDto;
import edu.ss1.bpmn.domain.exception.FailedAuthenticateException;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.service.user.CodeService;
import edu.ss1.bpmn.service.user.JwtService;
import edu.ss1.bpmn.service.user.UserService;
import edu.ss1.bpmn.service.util.JavaMailService;
import edu.ss1.bpmn.service.util.ThymeleafService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService tokenService;
    private final CodeService codeService;
    private final JavaMailService emailService;
    private final ThymeleafService templateRendererService;
    private final AuthenticationManager authManager;

    private TokenDto toTokenDto(UserDto user) {
        String token = tokenService.generateToken(user.id(), List.of(user.role().name()));
        return new TokenDto(token, user);
    }

    @PostMapping("/sign-up")
    @ResponseStatus(CREATED)
    public void signUp(@RequestBody @Valid AddUserDto user) {
        UserDto savedUser = userService.registerUser(user);

        String code = codeService.generateCode(savedUser.id());
        Map<String, Object> templateVariables = Map.of("code", code.toCharArray(), "user", user);
        String confirmationHtml = templateRendererService.renderTemplate("confirmation", templateVariables);

        try {
            emailService.sendHtmlEmail("BPMN", user.email(),
                    "Confirmacion de usuario en BPMN", confirmationHtml);
        } catch (MessagingException e) {
            throw new RequestConflictException("No se pudo enviar el correo de confirmacion");
        }
    }

    @PutMapping("/sign-up")
    public TokenDto confirmSignUp(@RequestBody @Valid ConfirmUserDto user) {
        boolean confirmed = codeService.confirmCode(user.email(), user.code());
        if (!confirmed) {
            throw new FailedAuthenticateException("No se pudo confirmar la cuenta");
        }

        return userService.findUserByEmail(user.email())
                .map(this::toTokenDto)
                .get();
    }

    @PostMapping("/sign-in")
    public void signIn(@RequestBody @Valid AuthUserDto user) {
        var authenticableUser = unauthenticated(user.email(), user.password());
        authManager.authenticate(authenticableUser);

        UserDto savedUser = userService.findUserByEmail(user.email()).get();

        String code = codeService.generateCode(savedUser.id());
        Map<String, Object> templateVariables = Map.of("code", code.toCharArray(), "user", savedUser);
        String confirmationHtml = templateRendererService.renderTemplate("confirmation", templateVariables);

        try {
            emailService.sendHtmlEmail("BPMN", user.email(),
                    "Confirmacion de usuario en BPMN", confirmationHtml);
        } catch (MessagingException e) {
            throw new RequestConflictException("No se pudo enviar el correo de confirmacion");
        }
    }

    @PutMapping("/sign-in/2fa")
    public TokenDto confirmSignIn(@RequestBody @Valid ConfirmUserDto user) {
        boolean confirmed = codeService.confirmCode(user.email(), user.code());
        if (!confirmed) {
            throw new FailedAuthenticateException("No se pudo confirmar la cuenta");
        }

        return userService.findUserByEmail(user.email())
                .map(this::toTokenDto)
                .get();
    }
}
