package com.coach.ghostcoach.utils;

import com.coach.ghostcoach.data.model.*;
import com.coach.ghostcoach.dtos.request.RegisterRequest;
import com.coach.ghostcoach.dtos.response.ChatResponse;


public class Mapper {

    public static Session createSession(Player player, String photoPath, Feedback feedback) {
        Session session = new Session();
        session.setPhotoPath(photoPath);
        session.setFeedback(feedback);
        session.setPlayer(player);
        return session;
    }

    public static Chatlog createChatLog(Session session) {
        Chatlog chatlog = new Chatlog();
        chatlog.setSession(session);
        return chatlog;
    }

    public static ChatMessage createChatMessage(Sender sender ,String message, Chatlog chatlog) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatlog(chatlog);
        chatMessage.setSender(sender);
        chatMessage.setContent(message);
        return chatMessage;
    }

    public static ChatResponse mapMessageToResponse(ChatMessage aiMessage) {
        ChatResponse chatResponse = new ChatResponse();
        chatResponse.setContent(aiMessage.getContent());
        chatResponse.setSender(aiMessage.getSender());
        chatResponse.setSentAt(aiMessage.getSentAt());
        return chatResponse;
    }
}
