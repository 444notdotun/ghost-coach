package com.coach.ghostcoach.dtos.request;

import com.coach.ghostcoach.data.model.Experience;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String password;
    private String email;
    private String sport;
    private String position;
    private Experience experienceLevel;
}
