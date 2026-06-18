export default function SessionsList({ sessions, loading, onSelect }) {
  if (loading) {
    return <div style={{ textAlign: "center", padding: 40, color: "var(--grey)" }}>Loading sessions...</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎯</div>
        <div className="empty-state-text">No sessions yet</div>
        <div className="empty-state-sub">Upload your first training image to get started.</div>
      </div>
    );
  }

  return (
    <div className="sessions-grid">
      {sessions.map((s, i) => (
        <div key={s.sessionId || i} className="session-card" onClick={() => onSelect(s)}>
          <div className="session-card-confidence">{s.feedback?.confidenceLevel || "—"}</div>
          <div className="session-card-score">{s.feedback?.overallScore || "—"}</div>
          <div className="session-card-label">Overall Score / 10</div>
          <div className="session-card-date">
            {s.createdAt
              ? new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
              : "Recent session"}
          </div>
        </div>
      ))}
    </div>
  );
}
