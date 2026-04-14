import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function CreateGame() {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!word.trim() || !hint.trim()) return setError("Both fields are required.");
    if (word.trim().length < 2) return setError("Word must be at least 2 characters.");

    try {
      setLoading(true);
      const token = await getToken();
      await axios.post(
        "/api/games",
        { word: word.trim(), hint: hint.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => navigate("/browse"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create game.");
    } finally {
      setLoading(false);
    }
  };

  const previewLetters = word.toUpperCase().replace(/[^A-Z ]/g, "");

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl animate-slide-up">
        {/* Header */}
        <div className="mb-10">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--vault-amber)",
              letterSpacing: "0.2em",
              marginBottom: 8,
            }}
          >
            // NEW PUZZLE
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 56, color: "var(--vault-text)", margin: 0, letterSpacing: "0.05em" }}>
            CREATE GAME
          </h1>
          <p style={{ color: "var(--vault-muted)", marginTop: 8, fontFamily: "var(--font-body)", fontSize: 15 }}>
            Set a word and a hint. Others will try to crack it.
          </p>
        </div>

        {success ? (
          <div
            style={{
              border: "1px solid var(--vault-green)",
              padding: 24,
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--vault-green)" }}>VAULT SEALED</div>
            <p style={{ color: "var(--vault-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>Redirecting to games...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Word input */}
            <div className="mb-6">
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--vault-amber)",
                  letterSpacing: "0.15em",
                  marginBottom: 8,
                }}
              >
                SECRET WORD
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g. PYTHON"
                maxLength={20}
                style={{
                  width: "100%",
                  background: "var(--vault-surface)",
                  border: "1px solid var(--vault-border)",
                  color: "var(--vault-text)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 20,
                  letterSpacing: "0.3em",
                  padding: "14px 18px",
                  outline: "none",
                  textTransform: "uppercase",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--vault-amber)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--vault-border)")}
              />
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-muted)", marginTop: 4 }}>
                {word.replace(/\s/g, "").length} / 20 characters
              </div>
            </div>

            {/* Letter preview */}
            {previewLetters.length > 0 && (
              <div className="mb-6 flex gap-2 flex-wrap">
                {previewLetters.split("").map((char, i) =>
                  char === " " ? (
                    <div key={i} style={{ width: 24, height: 52 }} />
                  ) : (
                    <div
                      key={i}
                      style={{
                        width: 44,
                        height: 52,
                        border: "1px solid var(--vault-amber)",
                        background: "var(--vault-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        color: "var(--vault-amber)",
                      }}
                    >
                      ?
                    </div>
                  )
                )}
              </div>
            )}

            {/* Hint input */}
            <div className="mb-8">
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--vault-amber)",
                  letterSpacing: "0.15em",
                  marginBottom: 8,
                }}
              >
                HINT
              </label>
              <textarea
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Give players a clue without giving it away..."
                rows={3}
                maxLength={200}
                style={{
                  width: "100%",
                  background: "var(--vault-surface)",
                  border: "1px solid var(--vault-border)",
                  color: "var(--vault-text)",
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  padding: "14px 18px",
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 0.2s",
                  lineHeight: 1.6,
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--vault-amber)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--vault-border)")}
              />
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-muted)", marginTop: 4 }}>
                {hint.length} / 200
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  border: "1px solid var(--vault-red)",
                  color: "var(--vault-red)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "10px 14px",
                  marginBottom: 16,
                  letterSpacing: "0.05em",
                }}
              >
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "var(--vault-border)" : "var(--vault-amber)",
                color: "#0a0a0f",
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                letterSpacing: "0.15em",
                padding: "16px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
                transition: "all 0.2s",
              }}
            >
              {loading ? "SEALING VAULT..." : "SEAL THE VAULT →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}