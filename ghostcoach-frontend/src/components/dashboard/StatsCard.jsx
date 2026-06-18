export default function StatsCard({ sessions }) {
  const total = sessions.length;
  const avg = total ? Math.round(sessions.reduce((a, s) => a + (s.feedback?.overallScore || 0), 0) / total) : 0;
  const best = total ? Math.max(...sessions.map(s => s.feedback?.overallScore || 0)) : 0;

  return (
    <div className="stats-card">
      <div className="card-label">Your Progress</div>
      <div className="stat-item">
        <span className="stat-label">Total Sessions</span>
        <span className="stat-value">{total}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Average Score</span>
        <span className="stat-value">{avg > 0 ? `${avg}/10` : "—"}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Best Score</span>
        <span className="stat-value">{best > 0 ? `${best}/10` : "—"}</span>
      </div>
      <div className="tip-box">
        <div className="tip-label">🏃 Coach Tip</div>
        <div className="tip-text">Consistent feedback sessions accelerate improvement. Aim for 3 sessions per week for best results.</div>
      </div>
    </div>
  );
}
