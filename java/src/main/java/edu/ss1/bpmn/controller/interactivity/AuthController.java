package edu.ss1.bpmn.controller.interactivity;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.security.authentication.UsernamePasswordAuthenticationToken.unauthenticated;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.ss1.bpmn.domain.dto.interactivity.user.AddUserDto;
import edu.ss1.bpmn.domain.dto.interactivity.user.AuthUserDto;
import edu.ss1.bpmn.domain.dto.interactivity.user.ChangePasswordDto;
import edu.ss1.bpmn.domain.dto.interactivity.user.ConfirmUserDto;
import edu.ss1.bpmn.domain.dto.interactivity.user.RecoverUserDto;
import edu.ss1.bpmn.domain.dto.interactivity.user.TokenDto;
import edu.ss1.bpmn.domain.dto.interactivity.user.UserDto;
import edu.ss1.bpmn.domain.exception.FailedAuthenticateException;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.service.interactivity.CodeService;
import edu.ss1.bpmn.service.interactivity.JwtService;
import edu.ss1.bpmn.service.interactivity.UserService;
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
                    "Confirmación de usuario en BPMN", confirmationHtml);
        } catch (MessagingException e) {
            throw new RequestConflictException("No se pudo enviar el correo de confirmación");
        }
    }

    @PutMapping("/sign-up")
    public TokenDto confirmSignUp(@RequestBody @Valid ConfirmUserDto user) {
        boolean confirmed = codeService.confirmCode(user.email(), user.code());
        if (!confirmed) {
            throw new FailedAuthenticateException("No se pudo confirmar la cuenta");
        }

        return userService.findAndVerifyUser(user.email())
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
                    "Confirmación de usuario en BPMN", confirmationHtml);
        } catch (MessagingException e) {
            throw new RequestConflictException("No se pudo enviar el correo de confirmación");
        }
    }

    @PutMapping("/sign-in/2fa")
    public TokenDto signInWith2fa(@RequestBody @Valid ConfirmUserDto user) {
        boolean confirmed = codeService.confirmCode(user.email(), user.code());
        if (!confirmed) {
            throw new FailedAuthenticateException("No se pudo confirmar el código de autenticación en dos pasos");
        }

        return userService.findUserByEmail(user.email())
                .map(this::toTokenDto)
                .get();
    }

    @PostMapping("/password/recovery")
    public void recoverPassword(@RequestBody @Valid RecoverUserDto user) {
        Optional<UserDto> savedUser = userService.findUserByEmail(user.email());

        if (savedUser.isEmpty()) {
            return;
        }
        UserDto userDto = savedUser.get();

        String code = codeService.generateCode(userDto.id());
        Map<String, Object> templateVariables = Map.of("code", code.toCharArray(), "user", userDto);
        String confirmationHtml = templateRendererService.renderTemplate("recovery", templateVariables);

        try {
            emailService.sendHtmlEmail("BPMN", user.email(),
                    "Recuperación de contraseña en BPMN", confirmationHtml);
        } catch (MessagingException e) {
            throw new RequestConflictException("No se pudo enviar el correo de recuperación");
        }
    }

    @PutMapping("/password/recovery")
    public TokenDto changePassword(@RequestBody @Valid ChangePasswordDto user) {
        boolean confirmed = codeService.confirmCode(user.email(), user.code());
        if (!confirmed) {
            throw new FailedAuthenticateException("No se pudo confirmar la posición de la cuenta");
        }

        return userService.changePassword(user.email(), user.password(), user.newPassword())
                .map(this::toTokenDto)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));
    }
}
