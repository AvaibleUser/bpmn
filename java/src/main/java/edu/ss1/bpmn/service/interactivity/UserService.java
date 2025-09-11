package edu.ss1.bpmn.service.interactivity;

import static edu.ss1.bpmn.domain.type.RoleType.CLIENT;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.ss1.bpmn.domain.dto.interactivity.user.AddUserDto;
import edu.ss1.bpmn.domain.dto.interactivity.user.UpdateUserRoleDto;
import edu.ss1.bpmn.domain.dto.interactivity.user.UserDto;
import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;
import edu.ss1.bpmn.repository.interactivity.UserRepository;
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
    public void changeRole(long userId, UpdateUserRoleDto user) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));

        userEntity.setRole(user.role());

        userRepository.save(userEntity);
    }

    @Transactional
    public void changeActive(long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));

        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    @Transactional
    public void changeBanned(long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ValueNotFoundException("No se encontró el usuario"));

        user.setBanned(true);
        userRepository.save(user);
    }

    @Transactional
    public Optional<UserDto> findAndVerifyUser(String email) {
        UserEntity user = userRepository.findByEmail(email, UserEntity.class)
                .orElseThrow(() -> new RequestConflictException("No se pudo encontrar al usuario"));

        user.setVerified(true);
        user.setActive(true);
        userRepository.saveAndFlush(user);

        return userRepository.findByEmail(email, UserDto.class);
    }

    @Transactional
    public Optional<UserDto> changePassword(String email, String oldPassword, String newPassword) {
        if (!oldPassword.equals(newPassword)) {
            throw new RequestConflictException("Las contraseñas no coinciden");
        }

        UserEntity user = userRepository.findByEmail(email, UserEntity.class)
                .orElseThrow(() -> new RequestConflictException("No se pudo encontrar al usuario"));

        String encryptedPassword = encoder.encode(newPassword);
        user.setPassword(encryptedPassword);

        userRepository.saveAndFlush(user);

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