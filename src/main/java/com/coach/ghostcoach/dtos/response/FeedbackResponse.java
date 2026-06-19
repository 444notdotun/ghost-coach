package com.coach.ghostcoach.dtos.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.UUID;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FeedbackResponse {
    private String sessionId;
    private int overallScore;
    private  String strengths;
    private String areasToImprove;
    private String priorityFix;
    private String drillSuggestion;
    private String confidenceLevel;
}
