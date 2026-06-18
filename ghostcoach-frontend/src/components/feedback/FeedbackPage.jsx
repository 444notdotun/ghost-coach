import Nav from "../layout/Nav.jsx";

export default function FeedbackPage({ session, isNew, onBack, onGoHome, onOpenChat }) {
  const fb = session?.feedback || session;
  const score = fb?.overallScore || 0;
  const pct = `${score * 10}%`;

  return (
    <div className="app">
      <Nav onHome={onGoHome} onBack={onBack} showBack />
      <div className="feedback-page">
        <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>

        <div className="feedback-hero">
          <div className="feedback-score-ring" style={{ "--pct": pct }}>
            <div className="feedback-score-inner">
              <div className="feedback-score-num">{score}</div>
              <div className="feedback-score-label">/ 10</div>
            </div>
          </div>
          <div>
            <div className="feedback-confidence">{fb?.confidenceLevel || "HIGH"} CONFIDENCE</div>
            <div className="feedback-title">{isNew ? "Your AI Coaching Report" : "Session Report"}</div>
            <div className="feedback-date">
              {session?.createdAt
                ? new Date(session.createdAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
                : "Latest session"}
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-primary" style={{ width: "auto", padding: "12px 24px" }} onClick={() => onOpenChat(session)}>
                💬 Chat with Your Coach
              </button>
            </div>
          </div>
        </div>

        <div className="feedback-priority">
          <div className="feedback-priority-label">🎯 Priority Fix</div>
          <div className="feedback-priority-text">{fb?.priorityFix || "—"}</div>
        </div>

        <div className="feedback-grid">
          <div className="feedback-item">
            <div className="feedback-item-label">✅ Strengths</div>
            <div className="feedback-item-text">{fb?.strengths || "—"}</div>
          </div>
          <div className="feedback-item">
            <div className="feedback-item-label">⚡ Areas to Improve</div>
            <div className="feedback-item-text">{fb?.areasToImprove || "—"}</div>
          </div>
          <div className="feedback-item" style={{ gridColumn: "1 / -1" }}>
            <div className="feedback-item-label">🏃 Drill Suggestion</div>
            <div className="feedback-item-text">{fb?.drillSuggestion || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
