package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.Player;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String generateToken(Player player);
    boolean validateToken(String token, UserDetails player);
    Claims extractClaims(String token);
}
