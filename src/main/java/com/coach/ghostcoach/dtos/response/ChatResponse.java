package com.coach.ghostcoach.dtos.response;

import com.coach.ghostcoach.data.model.Sender;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatResponse {
    private String content;
    private Sender sender;
    private LocalDateTime sentAt;
}
