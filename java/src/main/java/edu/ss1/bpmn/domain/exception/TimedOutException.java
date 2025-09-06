package edu.ss1.bpmn.domain.exception;

public class TimedOutException extends RuntimeException {

    public TimedOutException(String message) {
        super(message);
    }
}
