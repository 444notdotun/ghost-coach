package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.Chatlog;
import com.coach.ghostcoach.data.model.Feedback;
import com.coach.ghostcoach.data.model.Player;
import com.coach.ghostcoach.data.model.Session;
import com.coach.ghostcoach.data.repository.ChatLogRepository;
import com.coach.ghostcoach.data.repository.FeedbackRepository;
import com.coach.ghostcoach.data.repository.PlayerRepository;
import com.coach.ghostcoach.data.repository.SessionRepository;
import com.coach.ghostcoach.dtos.response.FeedbackResponse;
import com.coach.ghostcoach.dtos.response.SessionCard;
import com.coach.ghostcoach.exception.*;
import com.coach.ghostcoach.utils.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
@RequiredArgsConstructor
@Service
public class sessionImplementation implements SessionService {
    private final ArtificialIntelligence gemini;
    private final PlayerRepository playerRepository;
    private final SessionRepository sessionRepository;
    private final FeedbackRepository feedbackRepository;
    private final ChatLogRepository chatLogRepository;
    ModelMapper mapper = new ModelMapper();

    @Override
    public FeedbackResponse getFeedback(MultipartFile file, String playerEmail) {
        validateFile(file);
        String photoPath = saveFile(file);
        Player player = findUser(playerEmail);
        String prompt = prompt(player.getPosition(),player.getExperienceLevel().toString(),player.getSport());
        Feedback feedback =gemini.generateFeedback(file,prompt);
        feedbackRepository.save(feedback);
       Session session = Mapper.createSession(player,photoPath,feedback);
        createChatLog(session);
        sessionRepository.save(session);
       return mapper.map(feedback, FeedbackResponse.class);
    }

    private void createChatLog(Session session) {
        Chatlog chatlog =Mapper.createChatLog(session);
        chatLogRepository.save(chatlog);
    }

    @Override
    public SessionCard getSession(String sessionId) {
        Session session =sessionRepository.findBySessionId(sessionId).orElseThrow(()-> new SessionNotFoundException("Session Not Found"));
       Feedback feedback =  session.getFeedback();
        SessionCard sessionCard= mapper.map(session, SessionCard.class);
        sessionCard.setFullFeedback(feedback);
        return sessionCard;
    }

    @Override
    public List<Session> getAllSession(String playerEmail) {
        Player player = playerRepository.findByEmail(playerEmail).orElseThrow(()-> new PlayerNotFoundException("Player Not Found"));
        return sessionRepository.findSessionsByPlayer(player);
    }

    private String prompt(String position, String experienceLevel,String sport) {
        return ("You are an expert %s coaching analyst with deep knowledge " +
                "of player technique, biomechanics, and position-specific requirements. " +
                "Analyse the player's stance and body position in this image. " +
                "Player details: Position: %s Experience level: %s " +
                "Provide structured coaching feedback based strictly on what is visible in the image. " +
                "Return ONLY a valid JSON object with no additional text, no markdown, no code blocks, no explanation: " +
                "{\\\"overallScore\\\": 7, " +
                "\\\"strengths\\\": \\\"specific technical strengths visible in the stance\\\", " +
                "\\\"areasToImprove\\\": \\\"specific technical weaknesses visible in the stance\\\", " +
                "\\\"priorityFix\\\": \\\"the single most important thing to fix right now\\\", " +
                "\\\"drillSuggestion\\\": \\\"one specific drill to address the priority fix\\\", " +
                "\\\"confidenceLevel\\\": \\\"HIGH or MEDIUM or LOW based on image clarity and visibility\\\"} " +
                "If the image is unclear or the player is not visible, " +
                "set confidenceLevel to LOW and still provide best-effort feedback. " +
                "Do not return anything outside the JSON object.")
                .formatted(sport,position, experienceLevel);
    }

    private  String saveFile(MultipartFile file) {
        try{
            String fileName = UUID.randomUUID()+"_"+file.getOriginalFilename();
            Path uploadPath = Paths.get("PlayerUploads/Instance");
            isPathExist(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), uploadPath, StandardCopyOption.REPLACE_EXISTING);
            return filePath.toString();
        }catch (IOException e){
            throw new FileSaveException("failed to save file: "+ e.getMessage());
        }

    }

    private Player findUser(String playerEmail){
        return playerRepository.findByEmail(playerEmail).orElseThrow( ()-> new PlayerNotFoundException("user not found"));
    }

    private  void isPathExist(Path uploadPath) throws IOException {
        if(!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }
    }

    private void validateFile(MultipartFile file) {
        isEmpty(file);
        validateFileSize(file);
        validateContentType(file);
    }

    private  void validateContentType(MultipartFile file) {
        if(file.getContentType()==null || !file.getContentType().equals("image/jpeg")&& !file.getContentType().equals("image/png")) {
            throw new FileContentTypeException("wrong file type, only jpeg and png is allowed");
        }
    }

    private  void validateFileSize(MultipartFile file) {
        if(file.getSize()>5*1024*1024){
            throw new UploadSizeException("file should not be less than 5mb");
        }
    }

    private  void isEmpty(MultipartFile file) {
        if(file.isEmpty()){
            throw  new UploadIsEmptyException("file is empty ");
        }
    }
}
