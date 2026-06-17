package com.coach.ghostcoach.data.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.userdetails.User;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class ChatMessage{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID )
    private String id;
    private Sender sender;
    private String content;
    @CreationTimestamp
    private LocalDateTime sentAt;
    @ManyToOne
    @JoinColumn(name = "chatLogId")
    private Chatlog chatlog;
}
