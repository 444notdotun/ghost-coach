import { request } from "./client.js";

export function sendMessage(sessionId, message) {
  return request(`/GhostCoach/chatController/${sessionId}/chat?message=${encodeURIComponent(message)}`, {
    method: "POST",
  });
}
