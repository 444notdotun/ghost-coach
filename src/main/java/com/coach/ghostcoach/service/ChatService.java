package com.coach.ghostcoach.service;

import com.coach.ghostcoach.dtos.response.ChatResponse;

public interface ChatService {
     ChatResponse sendMessage(String sessionId, String message);
}
