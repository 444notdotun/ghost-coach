package com.coach.ghostcoach.data.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;
@Entity
@Data
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String sessionId;
    private  String photoPath;
    @ManyToOne
    @JoinColumn(name = "playerId")
    private Player player;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "feedbackId")
    private Feedback feedback;
    @CreationTimestamp
    private LocalDateTime createdAt;

}
