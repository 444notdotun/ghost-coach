package com.coach.ghostcoach.service;

import com.coach.ghostcoach.data.model.ChatMessage;
import com.coach.ghostcoach.data.model.Feedback;
import com.coach.ghostcoach.data.model.Player;
import com.coach.ghostcoach.data.model.Sender;
import com.coach.ghostcoach.exception.ConvertToBase64Exception;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Base64;
import java.util.List;

@Slf4j
@Service
public class Gemini implements ArtificialIntelligence{
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.endpoint}")
    private String geminiEndpoint;

    ObjectMapper objectMapper = new ObjectMapper();


    @Override
    public Feedback generateFeedback(MultipartFile file, String prompt) {
        HttpResponse<String> apiResponse = callGeminiApi(file, prompt);
        isError(apiResponse);
        String feedBackText = deSerializeApiResponse(apiResponse);
        return objectMapper.readValue(feedBackText, Feedback.class);
    }

    @Override
    public String chatAi(List<ChatMessage> messages, String newMessage, String systemContext) {
        HttpResponse<String> apiResponse = callGeminiApi(messages, newMessage, systemContext);
        isError(apiResponse);
        return deSerializeApiResponse(apiResponse);
    }


    private String deSerializeApiResponse(HttpResponse<String> apiResponse) {
        return objectMapper.readTree(apiResponse.body())
                .path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
    }

    private void isError(HttpResponse<String> apiResponse) {
        if(apiResponse.statusCode()!=200){
            String error = objectMapper.readTree(apiResponse.body())
                    .path("error")
                    .path("status")
                    .asText();
            throw new RuntimeException("google api call error : "+error);
        }
    }

    private HttpResponse<String> callGeminiApi(MultipartFile file, String prompt) {
        try( HttpClient client = HttpClient.newHttpClient()){
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(geminiEndpoint))
                    .header("Content-Type","application/json")
                    .header("x-goog-api-key",geminiApiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestPayLoad(prompt, file)))
                    .timeout(Duration.ofSeconds(30))
                    .build();
            return client.send(request,HttpResponse.BodyHandlers.ofString());

        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("google api call error : "+e.getMessage());
        }
    }

    private String requestPayLoad(String prompt, MultipartFile file){
       return getFormatedFile(prompt,  file);

    }

    private HttpResponse<String> callGeminiApi(List<ChatMessage> messages, String newMessage, String systemContext) {
        try( HttpClient client = HttpClient.newHttpClient()){
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(geminiEndpoint))
                    .header("Content-Type","application/json")
                    .header("x-goog-api-key",geminiApiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(getChatMessage(messages, systemContext, newMessage)))
                    .timeout(Duration.ofSeconds(30))
                    .build();
            return client.send(request,HttpResponse.BodyHandlers.ofString());

        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("google api call error : "+e.getMessage());
        }
    }

    private @NonNull String getFormatedFile(String prompt, MultipartFile file) {
        return """
                        {
                        "contents": [{
                        "parts":[
                        {
                            "inline_data": {
                            "mime_type":"%s",
                                    "data": "%s"
                        }
                        },
                        {"text": "%s"},
                ]
                    }]}""".formatted(file.getContentType(), convertFileToBase64(file), prompt);
    }

    private String getChatMessage(List<ChatMessage> messages, String systemContext, String newMessage) {
        return """
            {
                "contents": [
                    {"role": "user", "parts": [{"text": "%s"}]},
                    %s
                    {"role": "user", "parts": [{"text": "%s"}]}
                ]
            }
            """.formatted(
                systemContext,
                getConversation(messages),
                newMessage.replace("\"", "\\\"").replace("\n", "\\n")
        );
    }

    private String getConversation(List<ChatMessage> messages){
        StringBuilder stringBuilder = new StringBuilder();
        for (ChatMessage message : messages) {
            String role = message.getSender() == Sender.PLAYER ? "user" : "model";
            String text = message.getContent()
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n");
            stringBuilder.append("{\"role\": \"")
                    .append(role)
                    .append("\", \"parts\": [{\"text\": \"")
                    .append(text)
                    .append("\"}]},");
        }
        return stringBuilder.toString();
    }
    private String convertFileToBase64(MultipartFile file ){
        try{
            return Base64.getEncoder().encodeToString(file.getBytes());
        }catch (IOException e){
            throw new ConvertToBase64Exception("failed to convert file to base64 "+e.getMessage());
        }
    }

}
