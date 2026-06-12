package com.coach.ghostcoach.data.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Data
public class Chatlog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID chatLogId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Session session;
    @OneToMany(mappedBy = "chatlog", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<ChatMessage> messages;

}
