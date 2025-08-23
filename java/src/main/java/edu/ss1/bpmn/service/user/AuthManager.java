package edu.ss1.bpmn.service.user;

import static org.springframework.security.authentication.UsernamePasswordAuthenticationToken.authenticated;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.entity.user.UserEntity;
import edu.ss1.bpmn.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class AuthManager implements AuthenticationManager {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    @Transactional
    public Authentication authenticate(Authentication authUser) throws AuthenticationException {
        String email = authUser.getPrincipal().toString();
        String password = authUser.getCredentials().toString();

        UserEntity user = userRepository.findByEmail(email, UserEntity.class)
                .filter(dbUser -> encoder.matches(password, dbUser.getPassword()))
                .orElseThrow(() -> new BadCredentialsException("El email o la contraseña es incorrecta"));

        if (!user.isVerified()) {
            throw new InsufficientAuthenticationException("El usuario no ha sido verificado por e-mail");
        }
        if (user.isBanned() || !user.isActive()) {
            throw new InsufficientAuthenticationException("El usuario se encuentra baneado o no está activo");
        }

        return authenticated(email, password, user.getAuthorities());
    }
}
