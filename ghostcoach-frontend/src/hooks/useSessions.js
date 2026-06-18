import { useState, useEffect } from "react";
import { getAllSessions } from "../api/sessionApi.js";

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllSessions()
      .then(res => setSessions(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { sessions, loading, error };
}
