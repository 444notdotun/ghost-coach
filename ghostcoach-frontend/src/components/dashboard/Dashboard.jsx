import { useState, useEffect } from "react";
import Nav from "../layout/Nav.jsx";
import UploadCard from "./UploadCard.jsx";
import StatsCard from "./StatsCard.jsx";
import SessionsList from "./SessionsList.jsx";
import { useSessions } from "../../hooks/useSessions.js";
import { useAuth } from "../../context/AuthContext.jsx";

const DASHBOARD_PHOTOS = [
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&q=80",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&q=80",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
];

function getGreeting(email) {
  const hour = new Date().getHours();
  const name = email ? email.split("@")[0] : "Athlete";
  if (hour < 12) return { time: "Good Morning", name };
  if (hour < 17) return { time: "Good Afternoon", name };
  return { time: "Good Evening", name };
}

export default function Dashboard({ onViewSession }) {
  const { email } = useAuth();
  const { sessions, loading } = useSessions();
  const [bannerIdx, setBannerIdx] = useState(0);
  const { time, name } = getGreeting(email);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % DASHBOARD_PHOTOS.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="app">
      <Nav onHome={() => {}} showBack={false} />

      <div className="dash-banner">
        <img className="dash-banner-img" src={DASHBOARD_PHOTOS[bannerIdx]} alt="training" key={bannerIdx} />
        <div className="dash-banner-overlay" />
        <div className="dash-banner-content">
          <div className="dash-banner-time">{time}</div>
          <div className="dash-banner-greeting"><span>{name}</span></div>
          <div className="dash-banner-sub">Ready to get better today? Upload a training image for AI analysis.</div>
        </div>
      </div>

      <div className="dashboard">
        <div className="dashboard-grid">
          <UploadCard onFeedbackReady={session => onViewSession(session, true)} />
          <StatsCard sessions={sessions} />
        </div>

        <div className="sessions-section">
          <div className="section-title">Session History</div>
          <SessionsList sessions={sessions} loading={loading} onSelect={s => onViewSession(s, false)} />
        </div>
      </div>
    </div>
  );
}
