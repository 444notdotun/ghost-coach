import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { login as apiLogin, register as apiRegister } from "../../api/authApi.js";

const FITNESS_PHOTOS = [
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
  "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80",
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
];

const INITIAL_FORM = { email: "", password: "", sport: "football", position: "striker", experienceLevel: "BEGINNER" };

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [photoIdx, setPhotoIdx] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const t = setInterval(() => setPhotoIdx(i => (i + 1) % FITNESS_PHOTOS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const switchMode = (next) => { setMode(next); setError(""); setSuccess(""); };

  const submit = async () => {
    setError(""); setSuccess("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await apiLogin(form.email, form.password);
        login(res.data?.token || res.data, form.email);
      } else {
        await apiRegister(form);
        setSuccess("Account created! Sign in to start training.");
        switchMode("login");
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
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => update("email", e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => update("password", e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
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
                <input className="form-input" placeholder="e.g. Striker, Point Guard, Sprinter..."
                  value={form.position} onChange={e => update("position", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-select" value={form.experienceLevel} onChange={e => update("experienceLevel", e.target.value)}>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="PROFESSIONAL">Professional</option>
                </select>
              </div>
            </>
          )}

          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading
              ? <><span className="spinner" /> {mode === "login" ? "Signing in..." : "Creating account..."}</>
              : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <div className="auth-switch">
            {mode === "login"
              ? <>No account? <button onClick={() => switchMode("register")}>Sign up free</button></>
              : <>Have an account? <button onClick={() => switchMode("login")}>Sign in</button></>}
          </div>
        </div>
      </div>
    </div>
  );
}
