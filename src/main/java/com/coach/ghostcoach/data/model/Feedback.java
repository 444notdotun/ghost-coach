package com.coach.ghostcoach.data.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID feedbackId;
    private int overallScore;
    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String areasToImprove;

    @Column(columnDefinition = "TEXT")
    private String priorityFix;

    @Column(columnDefinition = "TEXT")
    private String drillSuggestion;
    private ConfidenceLevel confidenceLevel;
    @ManyToOne
    @JoinColumn(name = "sessionId")
    private Session session;

}
