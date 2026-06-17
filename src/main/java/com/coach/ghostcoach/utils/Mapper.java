package com.coach.ghostcoach.utils;

import com.coach.ghostcoach.data.model.Chatlog;
import com.coach.ghostcoach.data.model.Feedback;
import com.coach.ghostcoach.data.model.Player;
import com.coach.ghostcoach.data.model.Session;
import com.coach.ghostcoach.dtos.request.RegisterRequest;


public class Mapper {

    public static Session createSession(Player player, String photoPath, Feedback feedback) {
        Session session = new Session();
        session.setPhotoPath(photoPath);
        session.setFeedbackId(feedback);
        session.setPlayerId(player);
        return session;
    }

    public static Chatlog createChatLog(Session session) {
        Chatlog chatlog = new Chatlog();
        chatlog.setSession(session);
        return chatlog;
    }
}
