package edu.ss1.bpmn.service.user;

import static edu.ss1.bpmn.domain.type.RoleType.CLIENT;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.user.AddUserDto;
import edu.ss1.bpmn.domain.dto.user.UserDto;
import edu.ss1.bpmn.domain.entity.user.UserEntity;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email, UserEntity.class)
                .orElseThrow(() -> new UsernameNotFoundException("No se pudo encontrar al usuario"));
    }

    public Optional<UserDto> findUserByEmail(String email) {
        return userRepository.findByEmail(email, UserDto.class);
    }

    @Transactional
    public UserDto registerUser(AddUserDto user) {
        if (userRepository.existsByEmail(user.email())) {
            throw new RequestConflictException("El email que se intenta registrar ya esta en uso");
        }
        if (userRepository.existsByUsername(user.username())) {
            throw new RequestConflictException("El nombre de usuario que se intenta registrar ya esta en uso");
        }
        String encryptedPassword = encoder.encode(user.password());

        UserEntity newUser = UserEntity.builder()
                .username(user.username())
                .email(user.email())
                .password(encryptedPassword)
                .firstname(user.firstname())
                .lastname(user.lastname())
                .role(CLIENT)
                .build();

        userRepository.saveAndFlush(newUser);

        return userRepository.findByEmail(user.email(), UserDto.class).get();
    }
}