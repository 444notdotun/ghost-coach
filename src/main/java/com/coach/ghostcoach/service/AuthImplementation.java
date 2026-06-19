package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.Player;
import com.coach.ghostcoach.data.repository.PlayerRepository;
import com.coach.ghostcoach.dtos.request.LoginRequest;
import com.coach.ghostcoach.dtos.request.RegisterRequest;
import com.coach.ghostcoach.dtos.response.AuthResponse;
import com.coach.ghostcoach.exception.PlayerExistException;
import org.jspecify.annotations.NonNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

@Repository
public class AuthImplementation implements Auth {
    @Autowired
    private  PlayerRepository playerRepository;
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    @Lazy
    private AuthenticationManager authenticationManager;

    ModelMapper modelMapper = new ModelMapper();


    @Override
    public AuthResponse register(RegisterRequest request) {
        validateEmail(request.getEmail());
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        Player player = modelMapper.map(request,Player.class);
        playerRepository.save(player);
        AuthResponse authResponse = modelMapper.map(player, AuthResponse.class);
        authResponse.setToken(jwtService.generateToken(player));
        return authResponse;
    }

    private void validateEmail(String email){
        if(playerRepository.existsByEmail(email)){
            throw new PlayerExistException("Email already exists");
        }
    }
    @Override
    public AuthResponse login(LoginRequest login) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        login.getEmail(),
                        login.getPassword()
                )
        );
        Player player = (Player) authentication.getPrincipal();
        AuthResponse authResponse = modelMapper.map(player, AuthResponse.class);
        authResponse.setToken(jwtService.generateToken(player));
        return authResponse;
    }

    @Override
    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        return playerRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
