import { useState, useRef } from "react";
import { uploadForFeedback } from "../../api/sessionApi.js";

export default function UploadCard({ onFeedbackReady }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  const pickFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const res = await uploadForFeedback(file);
      if (!res.data) throw new Error("No feedback returned");
      const { sessionId, ...feedbackFields } = res.data;
      onFeedbackReady({ sessionId, feedback: feedbackFields });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">
      <div className="card-label">New Session</div>
      <div className="card-title">Analyse Your Stance</div>
      <div className="card-sub">Upload a clear photo of your training position for personalised feedback from your AI coach.</div>

      {error && <div className="error-msg">{error}</div>}

      {preview ? (
        <>
          <img src={preview} alt="preview" className="upload-preview" />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={removeFile}>Remove</button>
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
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => e.target.files[0] && pickFile(e.target.files[0])} />
        </div>
      )}
    </div>
  );
}
