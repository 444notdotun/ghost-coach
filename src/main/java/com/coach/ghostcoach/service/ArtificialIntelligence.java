package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.ChatMessage;
import com.coach.ghostcoach.data.model.Feedback;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ArtificialIntelligence {
    Feedback generateFeedback(MultipartFile file, String prompt);
    String chatAi(List<ChatMessage> messages,String newMessage,String systemContext);
}
