package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.*;
import com.coach.ghostcoach.data.repository.ChatLogRepository;
import com.coach.ghostcoach.data.repository.SessionRepository;
import com.coach.ghostcoach.dtos.response.ChatResponse;
import com.coach.ghostcoach.exception.ChatLogNotFoundException;
import com.coach.ghostcoach.exception.SessionNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ChatServiceImplementation implements ChatService{
    private final SessionRepository sessionRepository;
    private final ArtificialIntelligence gemini;
    private final ChatLogRepository chatLogRepository;

    @Override
    public ChatResponse sendMessage(String sessionId, String message) {
        Session session = sessionRepository.findByIdWithPlayerAndFeedback(sessionId).orElseThrow(()-> new SessionNotFoundException("Session Not Found"));
        Player player = session.getPlayer();
        Feedback feedback = session.getFeedback();
        Chatlog chatlog =chatLogRepository.findBySessionWithMessages(session).orElseThrow(()-> new ChatLogNotFoundException("chatlog, not found"));
        List<ChatMessage> messages = chatlog.getMessages();
        String conversationHistory = getConversationHistory(messages);
        String prompt = prompt(feedback,player,conversationHistory,message);


        return null;
    }

    private String prompt(Feedback feedback,Player player,  String conversationHistory, String newMessage) {
        return ("You are an expert football coaching assistant. " +
                "You only answer questions related to football, fitness, athletics, and sports performance. " +
                "If the question is unrelated to these topics, politely decline and redirect the player. " +
                "Use the player context and feedback below to give specific, personalised advice. " +
                "Never give generic answers. " +
                "Player context: " +
                "Sport: football. " +
                "Position: %s. " +
                "Experience level: %s. " +
                "Session feedback: " +
                "Overall score: %d out of 10. " +
                "Strengths: %s. " +
                "Areas to improve: %s. " +
                "Priority fix: %s. " +
                "Drill suggestion: %s. " +
                "Confidence level: %s. " +
                "Conversation so far: %s" +
                "Player question: %s " +
                "Respond in plain text, no markdown, no bullet points.")
                .formatted(
                        player.getPosition(),
                        player.getExperienceLevel(),
                        feedback.getOverallScore(),
                        feedback.getStrengths(),
                        feedback.getAreasToImprove(),
                        feedback.getPriorityFix(),
                        feedback.getDrillSuggestion(),
                        feedback.getConfidenceLevel(),
                        conversationHistory,
                        newMessage
                );
    }


    private String getConversationHistory(List<ChatMessage> messages){
        StringBuilder stringBuilder = new StringBuilder();
        int totalMessagesInList = messages.size();
        if(totalMessagesInList>5){
            for(int i = totalMessagesInList-1; i<=totalMessagesInList;i--){
                stringBuilder.append(messages.get(i)).append(",");
            }
        }else {
            for(int i = 0;i<totalMessagesInList;i++){
                stringBuilder.append(messages.get(i)).append(",");
            }
        }
        return stringBuilder.toString();
    }
}
