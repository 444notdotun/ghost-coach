import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("gc_token"));
  const [email, setEmail] = useState(() => localStorage.getItem("gc_email") || "");

  const login = (newToken, newEmail) => {
    localStorage.setItem("gc_token", newToken);
    localStorage.setItem("gc_email", newEmail);
    setToken(newToken);
    setEmail(newEmail);
  };

  const logout = () => {
    localStorage.removeItem("gc_token");
    localStorage.removeItem("gc_email");
    setToken(null);
    setEmail("");
  };

  return (
    <AuthContext.Provider value={{ token, email, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
