import { useState, useRef, useEffect } from "react";

const API = "https://ghostcoach-183135031185.us-central1.run.app";

const FITNESS_PHOTOS = [
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
  "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80",
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
];

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

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Barlow+Condensed:wght@700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0A0A0A;
    --surface: #141414;
    --surface2: #1E1E1E;
    --border: #2A2A2A;
    --lime: #C8F135;
    --lime-dim: #9BBF20;
    --white: #F0EDE6;
    --grey: #888;
    --red: #FF4444;
    --font-display: 'Barlow Condensed', Impact, sans-serif;
    --font-body: 'Inter', system-ui, sans-serif;
  }

  body { background: var(--black); color: var(--white); font-family: var(--font-body); min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* AUTH */
  .auth-page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }

  .auth-hero {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 48px;
  }

  .auth-hero-img {
    position: absolute;
    inset: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    transition: opacity 0.8s ease;
  }

  .auth-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 100%);
  }

  .auth-hero-slash {
    position: absolute;
    top: 0; right: -60px;
    width: 180px;
    height: 100%;
    background: var(--lime);
    transform: skewX(-8deg);
    opacity: 0.06;
  }

  .auth-photo-dots {
    position: absolute;
    bottom: 200px;
    left: 48px;
    display: flex;
    gap: 8px;
    z-index: 3;
  }

  .auth-photo-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    cursor: pointer;
    transition: all 0.3s;
  }

  .auth-photo-dot.active { background: var(--lime); width: 20px; border-radius: 3px; }

  .auth-hero-content { position: relative; z-index: 2; }

  .auth-hero-tag {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--lime);
    margin-bottom: 16px;
  }

  .auth-hero-title {
    font-family: var(--font-display);
    font-size: 72px;
    font-weight: 900;
    line-height: 0.9;
    text-transform: uppercase;
    color: var(--white);
    margin-bottom: 20px;
  }

  .auth-hero-title span { color: var(--lime); }
  .auth-hero-sub { font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.6; max-width: 360px; }

  .auth-form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    background: var(--black);
    overflow-y: auto;
  }

  .auth-form-inner { width: 100%; max-width: 400px; }

  .auth-logo {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 40px;
  }

  .auth-logo span { color: var(--lime); }
  .auth-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .auth-sub { font-size: 14px; color: var(--grey); margin-bottom: 36px; }

  .form-group { margin-bottom: 20px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--grey); margin-bottom: 8px; }

  .form-input, .form-select {
    width: 100%;
    padding: 14px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--white);
    font-family: var(--font-body);
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s;
  }

  .form-input:focus, .form-select:focus { border-color: var(--lime); }
  .form-select option { background: var(--surface); }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 24px;
    border-radius: 8px;
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }

  .btn-primary { background: var(--lime); color: var(--black); width: 100%; }
  .btn-primary:hover { background: var(--lime-dim); }
  .btn-ghost { background: transparent; color: var(--white); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--lime); color: var(--lime); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .auth-switch { margin-top: 24px; text-align: center; font-size: 14px; color: var(--grey); }
  .auth-switch button { background: none; border: none; color: var(--lime); cursor: pointer; font-size: 14px; font-weight: 600; }

  .success-msg { background: rgba(200,241,53,0.1); border: 1px solid var(--lime); border-radius: 8px; padding: 12px 16px; font-size: 14px; color: var(--lime); margin-bottom: 20px; }
  .error-msg { background: rgba(255,68,68,0.1); border: 1px solid var(--red); border-radius: 8px; padding: 12px 16px; font-size: 14px; color: var(--red); margin-bottom: 20px; }

  /* NAV */
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 40px;
    border-bottom: 1px solid var(--border);
    background: rgba(10,10,10,0.95);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-logo { font-family: var(--font-display); font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; }
  .nav-logo span { color: var(--lime); }
  .nav-actions { display: flex; gap: 12px; align-items: center; }
  .nav-user { font-size: 13px; color: var(--grey); }

  /* DASHBOARD HERO BANNER */
  .dash-banner {
    position: relative;
    height: 260px;
    overflow: hidden;
    margin-bottom: 0;
  }

  .dash-banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    transition: opacity 1s ease;
  }

  .dash-banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(10,10,10,0.9) 40%, rgba(10,10,10,0.3) 100%);
  }

  .dash-banner-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 40px;
  }

  .dash-banner-time { font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--lime); margin-bottom: 8px; }

  .dash-banner-greeting {
    font-family: var(--font-display);
    font-size: 48px;
    font-weight: 900;
    text-transform: uppercase;
    line-height: 1;
    margin-bottom: 8px;
  }

  .dash-banner-greeting span { color: var(--lime); }
  .dash-banner-sub { font-size: 15px; color: rgba(255,255,255,0.6); }

  /* DASHBOARD */
  .dashboard { max-width: 1200px; margin: 0 auto; width: 100%; padding: 32px 40px; }
  .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }

  .upload-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    position: relative;
    overflow: hidden;
  }

  .upload-card::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 120px; height: 120px;
    background: var(--lime);
    border-radius: 50%;
    opacity: 0.05;
  }

  .card-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--lime); margin-bottom: 12px; }
  .card-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
  .card-sub { font-size: 14px; color: var(--grey); margin-bottom: 24px; line-height: 1.5; }

  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 40px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 20px;
  }

  .upload-zone:hover, .upload-zone.dragover { border-color: var(--lime); background: rgba(200,241,53,0.04); }
  .upload-zone-icon { font-size: 40px; margin-bottom: 12px; }
  .upload-zone-text { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .upload-zone-sub { font-size: 13px; color: var(--grey); }

  .upload-preview { width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px; }

  .stats-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .stat-item { display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
  .stat-item:last-of-type { border-bottom: none; }
  .stat-label { font-size: 13px; color: var(--grey); }
  .stat-value { font-family: var(--font-display); font-size: 32px; font-weight: 900; color: var(--lime); }

  .tip-box { padding: 16px; background: rgba(200,241,53,0.06); border-radius: 10px; border: 1px solid rgba(200,241,53,0.15); }
  .tip-label { font-size: 11px; color: var(--lime); font-weight: 600; letter-spacing: 1px; margin-bottom: 6px; }
  .tip-text { font-size: 13px; color: var(--grey); line-height: 1.5; }

  .sessions-section { margin-top: 8px; }
  .section-title { font-size: 20px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .sessions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

  .session-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .session-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 2px;
    background: var(--lime);
    transition: width 0.3s;
  }

  .session-card:hover { border-color: var(--lime); transform: translateY(-2px); }
  .session-card:hover::after { width: 100%; }

  .session-card-score { font-family: var(--font-display); font-size: 48px; font-weight: 900; color: var(--lime); line-height: 1; margin-bottom: 8px; }
  .session-card-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--grey); margin-bottom: 12px; }
  .session-card-date { font-size: 13px; color: var(--grey); }
  .session-card-confidence { position: absolute; top: 16px; right: 16px; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; background: rgba(200,241,53,0.1); color: var(--lime); }

  .empty-state { text-align: center; padding: 60px 20px; color: var(--grey); }
  .empty-state-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state-text { font-size: 16px; margin-bottom: 8px; color: var(--white); }
  .empty-state-sub { font-size: 14px; }

  /* FEEDBACK */
  .feedback-page { padding: 40px; max-width: 900px; margin: 0 auto; width: 100%; }

  .back-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--grey); background: none; border: none; cursor: pointer; margin-bottom: 32px; transition: color 0.2s; }
  .back-btn:hover { color: var(--lime); }

  .feedback-hero {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px;
    margin-bottom: 24px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 40px;
    align-items: center;
  }

  .feedback-score-ring {
    width: 120px; height: 120px;
    border-radius: 50%;
    background: conic-gradient(var(--lime) var(--pct, 70%), var(--border) 0);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .feedback-score-inner { width: 90px; height: 90px; border-radius: 50%; background: var(--surface); display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .feedback-score-num { font-family: var(--font-display); font-size: 36px; font-weight: 900; color: var(--lime); line-height: 1; }
  .feedback-score-label { font-size: 10px; color: var(--grey); letter-spacing: 1px; }

  .feedback-confidence { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; background: rgba(200,241,53,0.1); color: var(--lime); margin-bottom: 12px; }
  .feedback-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .feedback-date { font-size: 14px; color: var(--grey); }

  .feedback-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }

  .feedback-item { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
  .feedback-item-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--lime); margin-bottom: 10px; }
  .feedback-item-text { font-size: 15px; line-height: 1.6; color: var(--white); }

  .feedback-priority { background: var(--surface); border: 1px solid var(--lime); border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .feedback-priority-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--lime); margin-bottom: 10px; }
  .feedback-priority-text { font-size: 16px; font-weight: 600; line-height: 1.5; }

  /* CHAT */
  .chat-page { display: flex; flex-direction: column; height: calc(100vh - 65px); }

  .chat-header { padding: 20px 40px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 16px; background: var(--surface); }
  .chat-header-info { flex: 1; }
  .chat-header-title { font-size: 18px; font-weight: 700; }
  .chat-header-sub { font-size: 13px; color: var(--grey); }

  .chat-messages { flex: 1; overflow-y: auto; padding: 32px 40px; display: flex; flex-direction: column; gap: 16px; }

  .chat-message { display: flex; gap: 12px; max-width: 70%; }
  .chat-message.player { align-self: flex-end; flex-direction: row-reverse; }
  .chat-message.ai { align-self: flex-start; }

  .chat-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .chat-avatar.ai { background: var(--lime); color: var(--black); font-size: 14px; font-weight: 700; }
  .chat-avatar.player { background: var(--surface2); }

  .chat-bubble { padding: 14px 18px; border-radius: 16px; font-size: 15px; line-height: 1.6; }
  .chat-message.ai .chat-bubble { background: var(--surface); border: 1px solid var(--border); border-top-left-radius: 4px; }
  .chat-message.player .chat-bubble { background: var(--lime); color: var(--black); font-weight: 500; border-top-right-radius: 4px; }

  .chat-input-area { padding: 20px 40px; border-top: 1px solid var(--border); display: flex; gap: 12px; background: var(--black); }

  .chat-input { flex: 1; padding: 14px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; color: var(--white); font-family: var(--font-body); font-size: 15px; outline: none; resize: none; transition: border-color 0.2s; }
  .chat-input:focus { border-color: var(--lime); }

  .chat-send { padding: 14px 24px; background: var(--lime); border: none; border-radius: 12px; color: var(--black); font-weight: 700; font-size: 15px; cursor: pointer; transition: background 0.2s; }
  .chat-send:hover { background: var(--lime-dim); }
  .chat-send:disabled { opacity: 0.5; cursor: not-allowed; }

  .typing { display: flex; gap: 4px; align-items: center; padding: 16px 18px; }
  .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--grey); animation: bounce 1s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.15s; }
  .typing-dot:nth-child(3) { animation-delay: 0.3s; }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

  .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid transparent; border-top-color: currentColor; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-hero { display: none; }
    .dashboard { padding: 20px; }
    .dashboard-grid { grid-template-columns: 1fr; }
    .dash-banner-content { padding: 0 20px; }
    .dash-banner-greeting { font-size: 36px; }
    .feedback-page { padding: 20px; }
    .feedback-hero { grid-template-columns: 1fr; }
    .feedback-grid { grid-template-columns: 1fr; }
    .chat-messages { padding: 20px; }
    .chat-input-area { padding: 16px 20px; }
    .nav { padding: 16px 20px; }
  }
`;

async function apiCall(path, options = {}, token = null) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [photoIdx, setPhotoIdx] = useState(0);
  const [form, setForm] = useState({ email: "", password: "", sport: "football", position: "striker", experienceLevel: "beginner" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const t = setInterval(() => setPhotoIdx(i => (i + 1) % FITNESS_PHOTOS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError(""); setSuccess("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await apiCall("/authController/login", { method: "POST", body: JSON.stringify({ email: form.email, password: form.password }) });
        onLogin(res.data?.token || res.data, form.email);
      } else {
        await apiCall("/authController/register", { method: "POST", body: JSON.stringify(form) });
        setSuccess("Account created! Sign in to start training.");
        setMode("login");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <img className="auth-hero-img" src={FITNESS_PHOTOS[photoIdx]} alt="athlete training" key={photoIdx} />
        <div className="auth-hero-overlay" />
        <div className="auth-hero-slash" />
        <div className="auth-photo-dots">
          {FITNESS_PHOTOS.map((_, i) => (
            <div key={i} className={`auth-photo-dot${i === photoIdx ? " active" : ""}`} onClick={() => setPhotoIdx(i)} />
          ))}
        </div>
        <div className="auth-hero-content">
          <div className="auth-hero-tag">AI Sports Coaching</div>
          <div className="auth-hero-title">Train<br />Smarter.<br /><span>Move</span><br />Better.</div>
          <div className="auth-hero-sub">Upload your stance. Get instant AI coaching feedback. Improve with every session.</div>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-logo">Ghost<span>Coach</span></div>
          <div className="auth-title">{mode === "login" ? "Welcome back" : "Create account"}</div>
          <div className="auth-sub">{mode === "login" ? "Sign in to continue your training" : "Start your coaching journey today"}</div>
          {success && <div className="success-msg">✓ {success}</div>}
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => update("email", e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => update("password", e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          {mode === "register" && (
            <>
              <div className="form-group">
                <label className="form-label">Sport</label>
                <select className="form-select" value={form.sport} onChange={e => update("sport", e.target.value)}>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                  <option value="athletics">Athletics</option>
                  <option value="boxing">Boxing</option>
                  <option value="swimming">Swimming</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Position / Role</label>
                <input className="form-input" placeholder="e.g. Striker, Point Guard, Sprinter..." value={form.position} onChange={e => update("position", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-select" value={form.experienceLevel} onChange={e => update("experienceLevel", e.target.value)}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
            </>
          )}
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? <><span className="spinner" /> {mode === "login" ? "Signing in..." : "Creating account..."}</> : mode === "login" ? "Sign In" : "Create Account"}
          </button>
          <div className="auth-switch">
            {mode === "login" ? <>No account? <button onClick={() => { setMode("register"); setError(""); setSuccess(""); }}>Sign up free</button></> : <>Have an account? <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>Sign in</button></>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Nav({ email, onLogout, onBack, showBack, onHome }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={onHome}>Ghost<span>Coach</span></div>
      <div className="nav-actions">
        {showBack && <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 14 }} onClick={onBack}>← Back</button>}
        <span className="nav-user">{email}</span>
        <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 14 }} onClick={onLogout}>Sign Out</button>
      </div>
    </nav>
  );
}

function Dashboard({ token, email, onViewSession, onLogout }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const fileRef = useRef();
  const { time, name } = getGreeting(email);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % DASHBOARD_PHOTOS.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    apiCall("/GhostCoach/session", {}, token)
      .then(r => setSessions(r.data || []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [token]);

  const pickFile = f => { setFile(f); setPreview(URL.createObjectURL(f)); };

  const analyze = async () => {
    if (!file) return;
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/GhostCoach/session/feedback`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Analysis failed");
      onViewSession(data.data, true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const totalSessions = sessions.length;
  const avgScore = totalSessions ? Math.round(sessions.reduce((a, s) => a + (s.feedback?.overallScore || 0), 0) / totalSessions) : 0;
  const bestScore = totalSessions ? Math.max(...sessions.map(s => s.feedback?.overallScore || 0)) : 0;

  return (
    <div className="app">
      <Nav email={email} onLogout={onLogout} onHome={() => {}} showBack={false} />
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
          <div className="upload-card">
            <div className="card-label">New Session</div>
            <div className="card-title">Analyse Your Stance</div>
            <div className="card-sub">Upload a clear photo of your training position for personalised feedback from your AI coach.</div>
            {error && <div className="error-msg">{error}</div>}
            {preview ? (
              <>
                <img src={preview} alt="preview" className="upload-preview" />
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setFile(null); setPreview(null); }}>Remove</button>
                  <button className="btn btn-primary" style={{ flex: 2 }} onClick={analyze} disabled={loading}>
                    {loading ? <><span className="spinner" /> Analysing...</> : "Get AI Feedback"}
                  </button>
                </div>
              </>
            ) : (
              <div
                className={`upload-zone${drag ? " dragover" : ""}`}
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) pickFile(e.dataTransfer.files[0]); }}
              >
                <div className="upload-zone-icon">📸</div>
                <div className="upload-zone-text">Drop your image here</div>
                <div className="upload-zone-sub">PNG or JPEG, max 5MB · Click or drag</div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files[0] && pickFile(e.target.files[0])} />
              </div>
            )}
          </div>

          <div className="stats-card">
            <div className="card-label">Your Progress</div>
            <div className="stat-item">
              <span className="stat-label">Total Sessions</span>
              <span className="stat-value">{totalSessions}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Score</span>
              <span className="stat-value">{avgScore > 0 ? `${avgScore}/10` : "—"}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Best Score</span>
              <span className="stat-value">{bestScore > 0 ? `${bestScore}/10` : "—"}</span>
            </div>
            <div className="tip-box">
              <div className="tip-label">🏃 Coach Tip</div>
              <div className="tip-text">Consistent feedback sessions accelerate improvement. Aim for 3 sessions per week for best results.</div>
            </div>
          </div>
        </div>

        <div className="sessions-section">
          <div className="section-title">Session History</div>
          {fetching ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--grey)" }}>Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <div className="empty-state-text">No sessions yet</div>
              <div className="empty-state-sub">Upload your first training image to get started.</div>
            </div>
          ) : (
            <div className="sessions-grid">
              {sessions.map((s, i) => (
                <div key={s.sessionId || i} className="session-card" onClick={() => onViewSession(s, false)}>
                  <div className="session-card-confidence">{s.feedback?.confidenceLevel || "—"}</div>
                  <div className="session-card-score">{s.feedback?.overallScore || "—"}</div>
                  <div className="session-card-label">Overall Score / 10</div>
                  <div className="session-card-date">{s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Recent session"}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeedbackPage({ session, token, email, onBack, onLogout, onHome, isNew }) {
  const fb = session?.feedback || session;
  const score = fb?.overallScore || 0;
  const pct = `${score * 10}%`;

  return (
    <div className="app">
      <Nav email={email} onLogout={onLogout} onBack={onBack} showBack onHome={onHome} />
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
            <div className="feedback-date">{session?.createdAt ? new Date(session.createdAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : "Latest session"}</div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-primary" style={{ width: "auto", padding: "12px 24px" }} onClick={() => onBack("chat", session)}>
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

function ChatPage({ session, token, email, onBack, onLogout, onHome }) {
  const [messages, setMessages] = useState([
    { sender: "AI", content: `Hey! I've reviewed your session. Your overall score was ${session?.feedback?.overallScore || session?.overallScore || "—"}/10. What would you like to work on today?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const sessionId = session?.sessionId || session?.id;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    setMessages(m => [...m, { sender: "PLAYER", content: msg }]);
    setLoading(true);
    try {
      const res = await apiCall(`/GhostCoach/chatController/${sessionId}/chat?message=${encodeURIComponent(msg)}`, { method: "POST" }, token);
      setMessages(m => [...m, { sender: "AI", content: res.data?.message || res.data }]);
    } catch (e) {
      setMessages(m => [...m, { sender: "AI", content: "Sorry, I couldn't process that. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Nav email={email} onLogout={onLogout} onBack={onBack} showBack onHome={onHome} />
      <div className="chat-page">
        <div className="chat-header">
          <button className="back-btn" style={{ margin: 0 }} onClick={onBack}>←</button>
          <div className="chat-header-info">
            <div className="chat-header-title">Ghost Coach AI</div>
            <div className="chat-header-sub">Session score: {session?.feedback?.overallScore || session?.overallScore || "—"}/10 · Ask me anything about your training</div>
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

export default function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [page, setPage] = useState("dashboard");
  const [activeSession, setActiveSession] = useState(null);
  const [isNewSession, setIsNewSession] = useState(false);

  const login = (t, e) => { setToken(t); setEmail(e); };
  const logout = () => { setToken(null); setEmail(""); setPage("dashboard"); setActiveSession(null); };

  const viewSession = (s, isNew) => { setActiveSession(s); setIsNewSession(isNew); setPage("feedback"); };

  const goBack = (target, data) => {
    if (target === "chat" && data) { setActiveSession(data); setPage("chat"); return; }
    setPage("dashboard");
  };

  if (!token) return <><style>{styles}</style><AuthPage onLogin={login} /></>;

  return (
    <>
      <style>{styles}</style>
      {page === "dashboard" && <Dashboard token={token} email={email} onViewSession={viewSession} onLogout={logout} />}
      {page === "feedback" && <FeedbackPage session={activeSession} token={token} email={email} onBack={goBack} onLogout={logout} onHome={() => setPage("dashboard")} isNew={isNewSession} />}
      {page === "chat" && <ChatPage session={activeSession} token={token} email={email} onBack={() => setPage("feedback")} onLogout={logout} onHome={() => setPage("dashboard")} />}
    </>
  );
}
