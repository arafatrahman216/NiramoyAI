package com.example.niramoy.error;

public class AgentProcessingException extends RuntimeException {
    public AgentProcessingException() {
        super();
    }

    public AgentProcessingException(String message) {
        super(message);
    }

    public AgentProcessingException(String message, Throwable cause) {
        super(message, cause);
    }

    public AgentProcessingException(Throwable cause) {
        super(cause);
    }
}