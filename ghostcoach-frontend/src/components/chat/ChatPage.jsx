import { useState, useEffect, useRef } from "react";
import Nav from "../layout/Nav.jsx";
import { sendMessage } from "../../api/chatApi.js";

export default function ChatPage({ session, onBack, onGoHome }) {
  const sessionId = session?.sessionId || session?.id;
  const score = session?.feedback?.overallScore || session?.overallScore || "—";

  const [messages, setMessages] = useState([
    { sender: "AI", content: `Hey! I've reviewed your session. Your overall score was ${score}/10. What would you like to work on today?` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    setMessages(m => [...m, { sender: "PLAYER", content: msg }]);
    setLoading(true);
    try {
      const res = await sendMessage(sessionId, msg);
      setMessages(m => [...m, { sender: "AI", content: res.data?.content }]);
    } catch {
      setMessages(m => [...m, { sender: "AI", content: "Sorry, I couldn't process that. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Nav onHome={onGoHome} onBack={onBack} showBack />
      <div className="chat-page">
        <div className="chat-header">
          <button className="back-btn" style={{ margin: 0 }} onClick={onBack}>←</button>
          <div className="chat-header-info">
            <div className="chat-header-title">Ghost Coach AI</div>
            <div className="chat-header-sub">Session score: {score}/10 · Ask me anything about your training</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--lime)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--black)", fontSize: 14, flexShrink: 0 }}>GC</div>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.sender === "PLAYER" ? "player" : "ai"}`}>
              <div className={`chat-avatar ${m.sender === "PLAYER" ? "player" : "ai"}`}>
                {m.sender === "PLAYER" ? "👤" : "GC"}
              </div>
              <div className="chat-bubble">{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-message ai">
              <div className="chat-avatar ai">GC</div>
              <div className="chat-bubble" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="typing">
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            className="chat-input"
            rows={1}
            placeholder="Ask your coach anything about your training..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>
            {loading ? <span className="spinner" /> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
