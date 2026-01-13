package com.imjjh.Dibs.common.exception;

public class InvalidOrMissingFieldException extends RuntimeException {

    public InvalidOrMissingFieldException(String message) {
        super(message);
    }

    public InvalidOrMissingFieldException(String message, Throwable cause) {
        super(message, cause);
    }
}
