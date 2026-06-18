const API_BASE = "http://127.0.0.1:8080";

function getToken() {
  return localStorage.getItem("gc_token");
}

export async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  const text = await res.text();
  let data = {};
  if (text) {
    try { data = JSON.parse(text); } catch { /* non-JSON body (e.g. empty 403) */ }
  }

  if (res.status === 401) {
    localStorage.removeItem("gc_token");
    localStorage.removeItem("gc_email");
    window.dispatchEvent(new Event("gc:unauthorized"));
    throw new Error("Session expired. Please sign in again.");
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
}

export const get = (path) => request(path, { method: "GET" });
export const post = (path, body) => request(path, { method: "POST", body: JSON.stringify(body) });
export const postForm = (path, formData) => request(path, { method: "POST", body: formData });
