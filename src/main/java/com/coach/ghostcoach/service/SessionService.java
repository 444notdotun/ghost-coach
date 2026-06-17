package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.Session;
import com.coach.ghostcoach.dtos.response.FeedbackResponse;
import com.coach.ghostcoach.dtos.response.SessionCard;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SessionService {
    FeedbackResponse getFeedback(MultipartFile file, String playerEmail);
    SessionCard getSession(String sessionId);
    List<Session> getAllSession(String playerEmail);
}
