package com.coach.ghostcoach.dtos.response;

import com.coach.ghostcoach.data.model.Feedback;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SessionCard {
    private String photoPath;
    private LocalDateTime createdAt;
    private String overallScore;
    private String priorityFix;
    private Feedback fullFeedback;
}
