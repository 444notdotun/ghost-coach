import { get, postForm } from "./client.js";

export function getAllSessions() {
  return get("/GhostCoach/session");
}

export function getSession(sessionId) {
  return get(`/GhostCoach/session/${sessionId}`);
}

export function uploadForFeedback(file) {
  const fd = new FormData();
  fd.append("file", file);
  return postForm("/GhostCoach/session/feedback", fd);
}
