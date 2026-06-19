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

const SPORTS = [
  { value: "football", label: "Football", icon: "⚽" },
  { value: "basketball", label: "Basketball", icon: "🏀" },
  { value: "tennis", label: "Tennis", icon: "🎾" },
  { value: "athletics", label: "Athletics", icon: "🏃" },
  { value: "boxing", label: "Boxing", icon: "🥊" },
  { value: "swimming", label: "Swimming", icon: "🏊" },
];

const LEVELS = [
  { value: "BEGINNER", label: "Beginner", desc: "Just starting out" },
  { value: "INTERMEDIATE", label: "Intermediate", desc: "Know the basics" },
  { value: "ADVANCED", label: "Advanced", desc: "Competing regularly" },
  { value: "PROFESSIONAL", label: "Professional", desc: "Elite level" },
];

const INITIAL_FORM = { email: "", password: "", sport: "football", position: "", experienceLevel: "BEGINNER" };

const STEP_LABELS = ["Account", "Your Sport", "Your Level"];

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setPhotoIdx(i => (i + 1) % FITNESS_PHOTOS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const switchMode = (next) => {
    setMode(next);
    setStep(1);
    setError("");
    setForm(INITIAL_FORM);
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!form.email.trim() || !form.password.trim()) {
        setError("Please fill in your email and password.");
        return;
      }
    }
    setStep(s => s + 1);
  };

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await apiLogin(form.email, form.password);
        const token = res.data?.token;
        if (!token) throw new Error("Login succeeded but no token was returned");
        login(token, form.email);
      } else {
        const res = await apiRegister(form);
        const token = res.data?.token;
        if (!token) throw new Error("Registration succeeded but no token was returned");
        login(token, form.email);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRegisterStep = () => {
    if (step === 1) {
      return (
        <>
          <div className="auth-title">Create account</div>
          <div className="auth-sub">Start your coaching journey today</div>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => update("email", e.target.value)} onKeyDown={e => e.key === "Enter" && nextStep()} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => update("password", e.target.value)} onKeyDown={e => e.key === "Enter" && nextStep()} />
          </div>
          <button className="btn btn-primary" onClick={nextStep}>Continue</button>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <div className="auth-title">What's your sport?</div>
          <div className="auth-sub">We'll tailor your coaching to your discipline</div>
          {error && <div className="error-msg">{error}</div>}
          <div className="sport-cards">
            {SPORTS.map(s => (
              <div
                key={s.value}
                className={`sport-card${form.sport === s.value ? " selected" : ""}`}
                onClick={() => update("sport", s.value)}
              >
                <div className="sport-card-icon">{s.icon}</div>
                <div className="sport-card-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Your position / role</label>
            <input
              className="form-input"
              placeholder="e.g. Striker, Point Guard, Sprinter..."
              value={form.position}
              onChange={e => update("position", e.target.value)}
              onKeyDown={e => e.key === "Enter" && nextStep()}
            />
          </div>
          <div className="auth-step-nav">
            <button className="btn btn-ghost" onClick={() => { setStep(1); setError(""); }}>Back</button>
            <button className="btn btn-primary" onClick={nextStep}>Continue</button>
          </div>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <div className="auth-title">What's your level?</div>
          <div className="auth-sub">Your coach will calibrate feedback to match your experience</div>
          {error && <div className="error-msg">{error}</div>}
          <div className="level-cards">
            {LEVELS.map(l => (
              <div
                key={l.value}
                className={`level-card${form.experienceLevel === l.value ? " selected" : ""}`}
                onClick={() => update("experienceLevel", l.value)}
              >
                <div className="level-card-info">
                  <div className="level-card-name">{l.label}</div>
                  <div className="level-card-desc">{l.desc}</div>
                </div>
                <div className="level-card-check">{form.experienceLevel === l.value ? "✓" : ""}</div>
              </div>
            ))}
          </div>
          <div className="auth-step-nav">
            <button className="btn btn-ghost" onClick={() => { setStep(2); setError(""); }}>Back</button>
            <button className="btn btn-primary" onClick={submit} disabled={loading}>
              {loading ? <><span className="spinner" /> Creating account...</> : "Create Account"}
            </button>
          </div>
        </>
      );
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

          {mode === "register" && (
            <div className="auth-step-progress">
              {STEP_LABELS.map((_, i) => (
                <div
                  key={i}
                  className={`auth-step-dot${i + 1 === step ? " active" : i + 1 < step ? " done" : ""}`}
                />
              ))}
            </div>
          )}

          {mode === "login" ? (
            <>
              <div className="auth-title">Welcome back</div>
              <div className="auth-sub">Sign in to continue your training</div>
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
              <button className="btn btn-primary" onClick={submit} disabled={loading}>
                {loading ? <><span className="spinner" /> Signing in...</> : "Sign In"}
              </button>
            </>
          ) : (
            renderRegisterStep()
          )}

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
