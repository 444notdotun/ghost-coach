package com.coach.ghostcoach.exception;

import com.coach.ghostcoach.dtos.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalException {
    @ExceptionHandler(PlayerExistException.class)
    public ResponseEntity<ApiResponse<?>> playerExistException(PlayerExistException e){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>("Error",e.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<?>> badCredentialsException(BadCredentialsException e){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>("Error",e.getMessage()));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> usernameNotFoundException(UsernameNotFoundException e){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>("Error",e.getMessage()));
    }
    @ExceptionHandler(FileContentTypeException.class)
    public ResponseEntity<ApiResponse<?>> fileContentTypeException(FileContentTypeException e){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>("Error",e.getMessage()));
    }
    @ExceptionHandler(UploadSizeException.class)
    public ResponseEntity<ApiResponse<?>> uploadSizeException(UploadSizeException e){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>("Error",e.getMessage()));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> exception(Exception e){
        return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("Error",e.getMessage()));
    }
}
