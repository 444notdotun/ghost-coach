package com.coach.ghostcoach.dtos.response;

import com.coach.ghostcoach.data.model.Sender;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class ChatResponse {
    private String content;
    private Sender sender;
    private LocalDateTime sentAt;
}
