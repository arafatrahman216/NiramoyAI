package com.example.niramoy.error;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
public class ApiError {

    private LocalDateTime timestamp;
    private HttpStatus status;
    private String error;
    private boolean success;

    public ApiError(){
        this.timestamp = LocalDateTime.now();
    }

    public ApiError(HttpStatus status, String error){
        this();
        this.status = status;
        this.error = error;
        this.success = false;
    }
}
