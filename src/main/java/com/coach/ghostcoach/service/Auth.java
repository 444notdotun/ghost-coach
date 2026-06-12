package com.coach.ghostcoach.service;

import com.coach.ghostcoach.dtos.request.LoginRequest;
import com.coach.ghostcoach.dtos.request.RegisterRequest;
import com.coach.ghostcoach.dtos.response.AuthResponse;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface Auth extends UserDetailsService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest login);
}
