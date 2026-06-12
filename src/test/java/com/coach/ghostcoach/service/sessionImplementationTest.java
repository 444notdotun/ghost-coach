package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.Experience;
import com.coach.ghostcoach.data.model.Player;
import com.coach.ghostcoach.data.repository.PlayerRepository;
import com.coach.ghostcoach.dtos.response.FeedbackResponse;
import com.coach.ghostcoach.exception.FileContentTypeException;
import com.coach.ghostcoach.exception.PlayerNotFoundException;
import com.coach.ghostcoach.exception.UploadIsEmptyException;
import com.coach.ghostcoach.exception.UploadSizeException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class sessionImplementationTest {
    @Autowired
    SessionService session;
    @Autowired
    private PlayerRepository playerRepository;


    @Test
    void testThatPlayerCanNotUploadEmptyImage() {
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/png", new byte[0]);
        assertThrows(UploadIsEmptyException.class, () -> session.getFeedback(file, "1234"));

    }

    @Test
    void teatThatPlayerCanNotUploadFileBiggerThan5mb() {
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/png", new byte[10 * 1024 * 1024]);
        assertThrows(UploadSizeException.class, () -> session.getFeedback(file, "1234"));
    }

    @Test
    void teatThatPlayerCanNotUploadFileWithWrongType() {
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/jjj", new byte[5 * 1024 * 1024]);
        assertThrows(FileContentTypeException.class, () -> session.getFeedback(file, "1234"));
    }

    @Test
    void testThatPlayerCanUploadFileAndGetFeedback() throws IOException {
        Player player = new Player();
        player.setEmail("12348");
        player.setExperienceLevel(Experience.BEGINNER);
        playerRepository.save(player);
        Path imagePath = Path.of("/home/notdotun/Desktop/GITHUB/GhostCoach/Screenshot 2026-06-11 at 07-53-50 (1) body - Search _ X.png");
        byte[] imageBytes = Files.readAllBytes(imagePath);
        MockMultipartFile file = new MockMultipartFile("file", "Screenshot 2026-06-11 at 07-53-50 (1) body - Search _ X.png", "image/png", imageBytes);
        FeedbackResponse feedbackResponse = session.getFeedback(file, "12348");
        assertNotNull(feedbackResponse);
        System.out.println(feedbackResponse);
    }

    @Test
    void testThatUnregisteredPlayerCanNotgetFeedback() {
        MockMultipartFile file = new MockMultipartFile("file", "Screenshot 2026-06-11 at 07-53-50 (1) body - Search _ X.png", "image/png", new byte[5 * 1024 * 1024]);
        assertThrows(PlayerNotFoundException.class, () -> session.getFeedback(file, "1234"));
    }

    @Test
    void testThatUsersCanGetAllSessions() throws IOException {
        Player player = new Player();
        player.setEmail("12340");
        player.setExperienceLevel(Experience.BEGINNER);
        playerRepository.save(player);
        Path imagePath = Path.of("/home/notdotun/Desktop/GITHUB/GhostCoach/Screenshot 2026-06-11 at 07-53-50 (1) body - Search _ X.png");
        byte[] imageBytes = Files.readAllBytes(imagePath);
        MockMultipartFile file = new MockMultipartFile("file", "Screenshot 2026-06-11 at 07-53-50 (1) body - Search _ X.png", "image/png", imageBytes);
        FeedbackResponse feedbackResponse = session.getFeedback(file, "12340");
        assertNotNull(feedbackResponse);
        MockMultipartFile file1 = new MockMultipartFile("file", "Screenshot 2026-06-11 at 07-53-50 (1) body - Search _ X.png", "image/png", imageBytes);
        FeedbackResponse feedbackResponse1 = session.getFeedback(file1, "12340");
        assertNotNull(feedbackResponse1);
        assertEquals(session.getAllSession(player.getEmail()).size(), 2);

    }



}