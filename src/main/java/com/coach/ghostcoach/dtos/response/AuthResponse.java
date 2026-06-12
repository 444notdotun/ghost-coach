package com.coach.ghostcoach.dtos.response;

import com.coach.ghostcoach.data.model.Experience;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private String sport;
    private String position;
    private Experience experienceLevel;
    private LocalDateTime createdAt;
}
