package edu.ss1.bpmn.service.interactivity;

import static java.util.function.Predicate.not;

import java.time.Instant;

import org.springframework.stereotype.Service;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

import edu.ss1.bpmn.domain.entity.interactivity.CodeEntity;
import edu.ss1.bpmn.domain.entity.interactivity.UserEntity;
import edu.ss1.bpmn.repository.interactivity.CodeRepository;
import edu.ss1.bpmn.repository.interactivity.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CodeService {

    private final UserRepository userRepository;
    private final CodeRepository codeRepository;
    private final GoogleAuthenticator googleAuth;

    public String generateCode(long userId) {
        UserEntity user = userRepository.findById(userId, UserEntity.class)
                .orElseThrow(() -> new RuntimeException("No se encontro el usuario"));

        GoogleAuthenticatorKey credentials = googleAuth.createCredentials();
        String totp = String.format("%06d", googleAuth.getTotpPassword(credentials.getKey()));

        CodeEntity code = CodeEntity.builder()
                .user(user)
                .code(totp)
                .expiresAt(user.getCreatedAt().plusSeconds(300))
                .build();

        codeRepository.save(code);

        return totp;
    }

    public boolean confirmCode(String email, String code) {
        return codeRepository.findByUserEmail(email, CodeEntity.class)
                .stream()
                .filter(not(CodeEntity::isUsed))
                .filter(c -> c.getExpiresAt().isAfter(Instant.now()))
                .filter(c -> c.getCode().equals(code))
                .anyMatch(c -> {
                    c.setUsed(true);
                    codeRepository.save(c);
                    return true;
                });
    }
}
