package com.coach.ghostcoach.service;

import com.coach.ghostcoach.dtos.request.LoginRequest;
import com.coach.ghostcoach.dtos.request.RegisterRequest;
import com.coach.ghostcoach.dtos.response.AuthResponse;
import com.coach.ghostcoach.exception.PlayerExistException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.TestPropertySource;

import static com.coach.ghostcoach.data.model.Experience.ADVANCED;
import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class AuthImplementationTest {
    @Autowired
    AuthImplementation authImplementation;
    RegisterRequest request;
    LoginRequest login;
    @BeforeEach
    void setUp() {

        request = new RegisterRequest();
        request.setPassword("password");
        request.setEmail("email1@gmail.com");
        request.setSport("football");
        request.setPosition("striker");
        request.setExperienceLevel(ADVANCED);
        request.setName("notdotun");
        login = new LoginRequest();
        login.setPassword("password");

    }

    @Test
    void testThatPlayersCanRegister() {
        AuthResponse authResponse =authImplementation.register(request);
        assertNotNull(authResponse);
        assertNotNull(authResponse.getToken());
    }

    @Test
    void testThatPlayerCanNotRegisterWithTheSameEmail() {
        request.setEmail("notdotun@gmail.com");
        testThatPlayersCanRegister();
        assertThrows(PlayerExistException.class,()->authImplementation.register(request));
    }

    @Test
    void testThatUserCanLoginAfterRegistartion() {
        request.setEmail("jon@gmail.com");
        AuthResponse authResponse =authImplementation.register(request);
        assertNotNull(authResponse);
        login.setEmail(request.getEmail());
        AuthResponse authResponse2 = authImplementation.login(login);
        assertNotNull(authResponse2);
        assertEquals(authResponse2.getEmail(),authResponse.getEmail());
    }

    @Test
    void testThatUnregisteredUserCanNotLogin(){
        login.setEmail("notdotun1@gmail.com");
        assertThrows(BadCredentialsException.class,()-> authImplementation.login(login));
    }


}