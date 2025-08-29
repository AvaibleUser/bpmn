package edu.ss1.bpmn.service.interactivity;

import java.time.Instant;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public String generateCode(long userId) {
        UserEntity user = userRepository.findById(userId, UserEntity.class)
                .orElseThrow(() -> new RuntimeException("No se encontro el usuario"));

        GoogleAuthenticatorKey credentials = googleAuth.createCredentials();
        String totp = String.format("%06d", googleAuth.getTotpPassword(credentials.getKey()));

        CodeEntity code = CodeEntity.builder()
                .user(user)
                .code(totp)
                .expiresAt(Instant.now().plusSeconds(300))
                .build();

        codeRepository.save(code);

        return totp;
    }

    @Transactional
    public boolean confirmCode(String email, String code) {
        return codeRepository.findByCodeAndUserEmailAndUsedFalse(code, email, CodeEntity.class)
                .stream()
                .filter(c -> c.getExpiresAt().isAfter(Instant.now()))
                .anyMatch(c -> {
                    c.setUsed(true);
                    codeRepository.save(c);
                    return true;
                });
    }
}
