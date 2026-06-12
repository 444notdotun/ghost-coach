package com.coach.ghostcoach.controller;

import com.coach.ghostcoach.dtos.response.ApiResponse;
import com.coach.ghostcoach.dtos.response.FeedbackResponse;
import com.coach.ghostcoach.dtos.response.SessionCard;
import com.coach.ghostcoach.service.SessionService;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
@Data
@RestController
@RequestMapping("GhostCoach/session")
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/feedback")
    public ResponseEntity<ApiResponse<FeedbackResponse>> getFeedback(@AuthenticationPrincipal UserDetails userDetails, @RequestParam MultipartFile file){
        String  PlayerEmail = userDetails.getUsername();
        return ResponseEntity.ok(new ApiResponse<>(sessionService.getFeedback(file,PlayerEmail)));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<SessionCard>> getSession(@PathVariable String sessionId){
        return ResponseEntity.status(HttpStatus.FOUND).body(new ApiResponse<>(sessionService.getSession(sessionId)));
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<?>> getSession(@AuthenticationPrincipal UserDetails userDetails){
        String  playerEmail = userDetails.getUsername();
        return ResponseEntity.ok(new ApiResponse<>(sessionService.getAllSession(playerEmail)));
    }
}
