package com.example.niramoy.error;

public class DuplicateUserException extends RuntimeException{
    public DuplicateUserException(String message){
        super(message);
    }
    public DuplicateUserException(){
        super();
    }
}
