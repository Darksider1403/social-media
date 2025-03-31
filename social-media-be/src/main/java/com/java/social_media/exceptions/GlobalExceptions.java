package com.java.social_media.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptions {
    @ExceptionHandler(UserException.class)
    public ResponseEntity<ErrorDetails> handleUserException(Exception uncaughtException,
                                                            WebRequest request) {
        ErrorDetails error = new ErrorDetails(uncaughtException.getMessage(),
                request.getDescription(false),
                LocalDateTime.now());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> otherExceptionsHandler(Exception uncaughtException,
                                                               WebRequest request) {
        ErrorDetails error = new ErrorDetails(uncaughtException.getMessage(),
                request.getDescription(false),
                LocalDateTime.now());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
