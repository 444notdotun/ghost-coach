Ghost Coach

AI-powered sports coaching platform that analyses player stance and technique from images and provides personalised coaching feedback through an intelligent chat interface.
Tech Stack

    Backend: Java 21, Spring Boot 4.0.6, Spring Security, Spring Data JPA
    Database: PostgreSQL (Supabase)
    AI: Google Gemini Vision API (gemini-2.0-flash)
    Auth: JWT (access token + refresh token)
    Deployment: Google Cloud Run
    Containerisation: Docker (multi-stage build)

Features

    Player registration and JWT authentication
    Image upload with AI-powered stance analysis
    Structured feedback — overall score, strengths, areas to improve, priority fix, drill suggestion, confidence level
    Context-aware AI chat per session — Gemini remembers player profile and session feedback
    Session history — view all past sessions and individual session details

Prerequisites

    Java 21
    Maven
    PostgreSQL database (or Supabase)
    Google Gemini API key

Environment Variables

Create a .env file in the root directory:

SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/ghostcoach?sslmode=require
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

Running Locally
bash

git clone https://github.com/444notdotun/GhostCoach
cd GhostCoach
mvn clean install -DskipTests
mvn spring-boot:run

Running with Docker
bash

docker build -t ghostcoach .
docker run -p 8080:8080 \
-e SPRING_DATASOURCE_URL=your_db_url \
-e SPRING_DATASOURCE_USERNAME=your_username \
-e SPRING_DATASOURCE_PASSWORD=your_password \
-e JWT_SECRET=your_secret \
-e GEMINI_API_KEY=your_key \
ghostcoach

API Reference
Authentication
Register

POST /authController/register

Request body:
json

{
"email": "player@example.com",
"password": "password123",
"sport": "football",
"position": "striker",
"experienceLevel": "intermediate"
}

Login

POST /authController/login

Request body:
json

{
"email": "player@example.com",
"password": "password123"
}

Returns a JWT access token. Include in all subsequent requests as:

Authorization: Bearer <token>

Session
Get AI Feedback from Image

POST /GhostCoach/session/feedback
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form field: file — image of the player (PNG or JPEG, max 5MB)

Response:
json

{
"data": {
"sessionId": "uuid",
"overallScore": 7,
"strengths": "...",
"areasToImprove": "...",
"priorityFix": "...",
"drillSuggestion": "...",
"confidenceLevel": "HIGH"
}
}

Get All Sessions

GET /GhostCoach/session
Authorization: Bearer <token>

Get Single Session

GET /GhostCoach/session/{sessionId}

Chat
Send Chat Message

POST /GhostCoach/chatController/{sessionId}/chat?message=your question here
Authorization: Bearer <token>

The chat endpoint is context-aware. Gemini receives the player's sport, position, experience level, session feedback, and the last 5 messages from the conversation history. Responses are specific to the player's profile — not generic coaching advice.

Response:
json

{
"data": {
"message": "AI coaching response here",
"sender": "AI"
}
}

Project Structure

src/main/java/com/coach/ghostcoach/
├── config/          # Security config, JWT config
├── controller/      # AuthController, SessionController, ChatController
├── data/model/      # Player, Session, Feedback, Chatlog, ChatMessage
├── dtos/            # Request and response DTOs
├── exception/       # Custom exceptions and GlobalException handler
├── service/         # Business logic, Gemini integration
└── utils/           # Utility classes

Deployment

The app is deployed on Google Cloud Run. The Dockerfile uses a multi-stage build — Maven builder stage compiles the JAR, a slim JRE runtime stage runs it.

Live URL: https://ghostcoach-183135031185.us-central1.run.app