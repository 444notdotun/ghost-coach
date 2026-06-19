import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./components/auth/AuthPage.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import FeedbackPage from "./components/feedback/FeedbackPage.jsx";
import ChatPage from "./components/chat/ChatPage.jsx";

export default function App() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [activeSession, setActiveSession] = useState(null);
  const [isNewSession, setIsNewSession] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setPage("dashboard");
      setActiveSession(null);
      setIsNewSession(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return <AuthPage />;

  const viewSession = (session, isNew) => {
    setActiveSession(session);
    setIsNewSession(isNew);
    setPage("feedback");
  };

  const openChat = (session) => {
    setActiveSession(session);
    setPage("chat");
  };

  const goHome = () => setPage("dashboard");

  if (page === "feedback" && activeSession) {
    return (
      <FeedbackPage
        session={activeSession}
        isNew={isNewSession}
        onBack={goHome}
        onGoHome={goHome}
        onOpenChat={openChat}
      />
    );
  }

  if (page === "chat" && activeSession) {
    return (
      <ChatPage
        session={activeSession}
        onBack={() => setPage("feedback")}
        onGoHome={goHome}
      />
    );
  }

  return <Dashboard onViewSession={viewSession} />;
}
