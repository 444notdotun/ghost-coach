import { useAuth } from "../../context/AuthContext.jsx";

export default function Nav({ onHome, onBack, showBack }) {
  const { email, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={onHome}>Ghost<span>Coach</span></div>
      <div className="nav-actions">
        {showBack && (
          <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 14 }} onClick={onBack}>
            ← Back
          </button>
        )}
        <span className="nav-user">{email}</span>
        <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 14 }} onClick={logout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
