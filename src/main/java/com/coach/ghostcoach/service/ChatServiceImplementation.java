package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.*;
import com.coach.ghostcoach.data.repository.ChatLogRepository;
import com.coach.ghostcoach.data.repository.ChatMessageRepository;
import com.coach.ghostcoach.data.repository.SessionRepository;
import com.coach.ghostcoach.dtos.response.ChatResponse;
import com.coach.ghostcoach.exception.ChatLogNotFoundException;
import com.coach.ghostcoach.exception.SessionNotFoundException;
import com.coach.ghostcoach.utils.Mapper;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ChatServiceImplementation implements ChatService{
    private final SessionRepository sessionRepository;
    private final ArtificialIntelligence gemini;
    private final ChatLogRepository chatLogRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public ChatResponse sendMessage(String sessionId, String message) {
        Session session = sessionRepository.findByIdWithPlayerAndFeedback(sessionId).orElseThrow(()-> new SessionNotFoundException("Session Not Found"));
        Player player = session.getPlayer();
        Feedback feedback = session.getFeedback();
        Chatlog chatlog =chatLogRepository.findBySessionWithMessages(session).orElseThrow(()-> new ChatLogNotFoundException("chatlog, not found"));
        List<ChatMessage> lastFive = getChatMessages(chatlog);
        String systemedContext = systemContext(feedback,player);
        String aiResponse = gemini.chatAi(lastFive,message,systemedContext);
        ChatMessage  playerMessage = Mapper.createChatMessage(Sender.PLAYER,message,chatlog);
        ChatMessage aiMessage = Mapper.createChatMessage(Sender.AI,aiResponse,chatlog);
        chatMessageRepository.save(playerMessage);
        chatMessageRepository.save(aiMessage);
        return Mapper.mapMessageToResponse(aiMessage);
    }

    private static @NonNull List<ChatMessage> getChatMessages(Chatlog chatlog) {
        List<ChatMessage> messages = chatlog.getMessages();
        int start = Math.max(0, messages.size() - 5);
        return messages.subList(start, messages.size());
    }

    private String systemContext(Feedback feedback,Player player) {
            return ("You are an expert %s coaching assistant. " +
                    "You only answer questions related to %s, fitness, athletics, and sports performance. " +
                    "If the question is unrelated to these topics, politely decline and redirect the player. " +
                    "Use the player context and feedback below to give specific, personalised advice. " +
                    "Never give generic answers. " +
                    "Player context: " +
                    "Sport: %s. " +
                    "Position: %s. " +
                    "Experience level: %s. " +
                    "Session feedback: " +
                    "Overall score: %d out of 10. " +
                    "Strengths: %s. " +
                    "Areas to improve: %s. " +
                    "Priority fix: %s. " +
                    "Drill suggestion: %s. " +
                    "Confidence level: %s. " +
                    "Respond in plain text, no markdown, no bullet points.")
                    .formatted(
                            player.getSport(),
                            player.getSport(),
                            player.getSport(),
                            player.getPosition(),
                            player.getExperienceLevel(),
                            feedback.getOverallScore(),
                            feedback.getStrengths().replace("\"", "\\\"").replace("\n", "\\n"),
                            feedback.getAreasToImprove().replace("\"", "\\\"").replace("\n", "\\n"),
                            feedback.getPriorityFix().replace("\"", "\\\"").replace("\n", "\\n"),
                            feedback.getDrillSuggestion().replace("\"", "\\\"").replace("\n", "\\n"),
                            feedback.getConfidenceLevel()
                    );
    }



}
