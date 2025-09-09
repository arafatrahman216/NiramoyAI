package com.example.niramoy.error;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiError> handleUsernameNotFound(UsernameNotFoundException ex){
        ApiError apiError= new ApiError( HttpStatus.NOT_FOUND, "User not found. "+" "+ex.getMessage());
        return ResponseEntity.status(404).body(apiError);

    }



    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAllExceptions(Exception ex){
        ApiError apiError= new ApiError( HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error "+" "+ex.getMessage());
        return ResponseEntity.status(500).body(apiError);
    }

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<ApiError> handleDuplicateUserException(DuplicateUserException ex){
        ApiError apiError= new ApiError( HttpStatus.BAD_REQUEST, "Duplicate User Found. "+ex.getMessage());
        return ResponseEntity.status(400).body(apiError);
    }
}

