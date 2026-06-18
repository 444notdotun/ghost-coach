package com.coach.ghostcoach.controller;

import com.coach.ghostcoach.dtos.request.LoginRequest;
import com.coach.ghostcoach.dtos.request.RegisterRequest;
import com.coach.ghostcoach.dtos.response.ApiResponse;
import com.coach.ghostcoach.dtos.response.AuthResponse;
import com.coach.ghostcoach.service.AuthImplementation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("authController")
public class AuthController {
    @Autowired
    private AuthImplementation authImplementation;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody RegisterRequest registerRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(authImplementation.register(registerRequest)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(authImplementation.login(loginRequest)));
    }
}
