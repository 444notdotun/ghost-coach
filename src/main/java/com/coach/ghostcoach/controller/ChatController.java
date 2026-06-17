package com.coach.ghostcoach.controller;


import com.coach.ghostcoach.dtos.response.ApiResponse;
import com.coach.ghostcoach.dtos.response.ChatResponse;
import com.coach.ghostcoach.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RequiredArgsConstructor
@RestController
@RequestMapping("GhostCoach/chatController")
public class ChatController {
    private final ChatService ChatService;
    @PostMapping("/{sessionId}/chat")
    public ResponseEntity<ApiResponse<ChatResponse>> chat(@RequestParam String  message, @PathVariable String sessionId){
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(ChatService.sendMessage(sessionId, message)));

    }
}
