package edu.ss1.bpmn.domain.exception;

public class RequestConflictException extends RuntimeException {

    public RequestConflictException(String message) {
        super(message);
    }
}
