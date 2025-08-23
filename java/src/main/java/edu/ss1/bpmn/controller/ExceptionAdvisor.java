package edu.ss1.bpmn.controller;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import edu.ss1.bpmn.domain.exception.BadRequestException;
import edu.ss1.bpmn.domain.exception.FailedAuthenticateException;
import edu.ss1.bpmn.domain.exception.RequestConflictException;
import edu.ss1.bpmn.domain.exception.ValueNotFoundException;

@ControllerAdvice
public class ExceptionAdvisor extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ExceptionInfo> handleBadRequest(BadRequestException ex, WebRequest request) {
        ExceptionInfo info = new ExceptionInfo(ex.getMessage(), Instant.now());
        return new ResponseEntity<>(info, BAD_REQUEST);
    }

    @ExceptionHandler(FailedAuthenticateException.class)
    public ResponseEntity<ExceptionInfo> handleFailedAuthenticate(FailedAuthenticateException ex, WebRequest request) {
        ExceptionInfo info = new ExceptionInfo(ex.getMessage(), Instant.now());
        return new ResponseEntity<>(info, UNAUTHORIZED);
    }

    @ExceptionHandler(RequestConflictException.class)
    public ResponseEntity<ExceptionInfo> handleRequestConflict(RequestConflictException ex, WebRequest request) {
        ExceptionInfo info = new ExceptionInfo(ex.getMessage(), Instant.now());
        return new ResponseEntity<>(info, CONFLICT);
    }

    @ExceptionHandler(ValueNotFoundException.class)
    public ResponseEntity<ExceptionInfo> handleValueNotFound(ValueNotFoundException ex, WebRequest request) {
        ExceptionInfo info = new ExceptionInfo(ex.getMessage(), Instant.now());
        return new ResponseEntity<>(info, NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionInfo> handleCredentialsException(BadCredentialsException ex, WebRequest request) {
        ExceptionInfo info = new ExceptionInfo(ex.getMessage(), Instant.now());
        return new ResponseEntity<>(info, UNAUTHORIZED);
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ExceptionInfo> handleInsufficientAuthenticationException(
            InsufficientAuthenticationException ex, WebRequest request) {
        ExceptionInfo info = new ExceptionInfo(ex.getMessage(), Instant.now());
        return new ResponseEntity<>(info, UNAUTHORIZED);
    }

    @Override
    public ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {

        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(s -> String.format("The field '%s' %s", s.getField(), s.getDefaultMessage()))
                .collect(Collectors.toList());

        ExceptionExtendedInfo info = new ExceptionExtendedInfo(
                String.format("The object '%s' has validation errors.", ex.getObjectName()), Instant.now(), errors);

        return new ResponseEntity<>(info, HttpStatus.BAD_REQUEST);
    }
}

record ExceptionInfo(String message, Instant timestamp) {
}

record ExceptionExtendedInfo(String message, Instant timestamp, List<String> errors) {
}
