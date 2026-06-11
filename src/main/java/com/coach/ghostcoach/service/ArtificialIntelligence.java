package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.Feedback;
import org.springframework.web.multipart.MultipartFile;

public interface ArtificialIntelligence {
    Feedback generateFeedback(MultipartFile file, String prompt);
}
