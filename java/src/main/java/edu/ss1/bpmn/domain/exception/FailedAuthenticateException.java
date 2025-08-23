package edu.ss1.bpmn.domain.exception;

public class FailedAuthenticateException extends RuntimeException {

    public FailedAuthenticateException(String message) {
        super(message);
    }
}
