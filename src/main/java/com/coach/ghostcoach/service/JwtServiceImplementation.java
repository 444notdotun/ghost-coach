package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.Player;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
@Service
public class JwtServiceImplementation implements JwtService {
    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private Long expiration;

    @Override
    public String generateToken(Player player) {
        return Jwts.builder()
                .signWith(encodeKey(secretKey))
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+expiration))
                .subject(player.getEmail())
                .compact();

    }


    @Override
    public boolean validateToken(String token, UserDetails player) {
        String email = extractClaims(token).getSubject();
        System.out.println(email);
        System.out.println("new validation"+ isTokenExpired(token));
        return email.equals(player.getUsername()) && !isTokenExpired(token) ;
    }

    @Override
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(encodeKey(secretKey))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    private boolean isTokenExpired(String token) {
       Claims claims = extractClaims(token);
       System.out.println("new date"+claims.getExpiration().before(new Date()));
       return claims.getExpiration().before(new Date());
    }

    private SecretKey encodeKey(String secretKey){
        byte[] decodedSecretKey = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(decodedSecretKey);
    }
}
