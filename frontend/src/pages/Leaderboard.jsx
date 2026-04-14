import { useState, useEffect } from "react";
import axios from "axios";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: lb } = await axios.get("/api/scores/leaderboard");
        setData(lb);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <div
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-amber)", letterSpacing: "0.2em", marginBottom: 8 }}
        >
          // HALL OF CRACKERS
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 10vw, 80px)",
            color: "var(--vault-text)",
            margin: 0,
            letterSpacing: "0.05em",
          }}
          className="animate-flicker"
        >
          LEADERBOARD
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-24">
          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--vault-amber)" }} className="animate-flicker">
            LOADING RANKINGS...
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-24">
          <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--vault-muted)" }}>NO DATA YET</div>
          <p style={{ color: "var(--vault-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>Be the first to play a game!</p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {top3.length > 0 && (
            <div className="flex items-end justify-center gap-4 mb-12">
              {[top3[1], top3[0], top3[2]].filter(Boolean).map((entry, podiumIdx) => {
                const actualRank = data.indexOf(entry);
                const heights = [160, 200, 140];
                const podiumOrder = [1, 0, 2];
                const h = heights[podiumIdx];
                return (
                  <div
                    key={entry._id}
                    className="flex flex-col items-center animate-slide-up"
                    style={{ animationDelay: `${podiumIdx * 0.1}s`, opacity: 0, flex: 1, maxWidth: 180 }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: actualRank === 0 ? 56 : 44,
                        height: actualRank === 0 ? 56 : 44,
                        borderRadius: "50%",
                        border: `2px solid ${actualRank === 0 ? "var(--vault-amber)" : "var(--vault-border)"}`,
                        overflow: "hidden",
                        marginBottom: 8,
                        background: "var(--vault-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {entry.avatar ? (
                        <img src={entry.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--vault-amber)" }}>
                          {entry.username?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{MEDALS[actualRank]}</div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--vault-text)",
                        marginBottom: 8,
                        textAlign: "center",
                        wordBreak: "break-all",
                      }}
                    >
                      {entry.username}
                    </div>
                    {/* Podium bar */}
                    <div
                      style={{
                        width: "100%",
                        height: h,
                        background: actualRank === 0 ? "rgba(245,166,35,0.12)" : "var(--vault-card)",
                        border: `1px solid ${actualRank === 0 ? "var(--vault-amber)" : "var(--vault-border)"}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: actualRank === 0 ? 32 : 24,
                          color: actualRank === 0 ? "var(--vault-amber)" : "var(--vault-text)",
                        }}
                      >
                        {entry.totalScore.toLocaleString()}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--vault-muted)", letterSpacing: "0.1em" }}>
                        TOTAL SCORE
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--vault-muted)" }}>
                        {entry.gamesWon}/{entry.gamesPlayed} WON
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rest of leaderboard */}
          <div
            style={{
              border: "1px solid var(--vault-border)",
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 120px 80px 80px",
                padding: "12px 20px",
                borderBottom: "1px solid var(--vault-border)",
                background: "var(--vault-surface)",
              }}
            >
              {["RANK", "PLAYER", "TOTAL", "PLAYED", "WON"].map((h) => (
                <div key={h} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--vault-muted)", letterSpacing: "0.12em" }}>
                  {h}
                </div>
              ))}
            </div>

            {data.map((entry, index) => (
              <div
                key={entry._id}
                className="animate-fade-in"
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 120px 80px 80px",
                  padding: "14px 20px",
                  borderBottom: index < data.length - 1 ? "1px solid var(--vault-border)" : "none",
                  background: index < 3 ? "rgba(245,166,35,0.02)" : "transparent",
                  alignItems: "center",
                  animationDelay: `${index * 0.04}s`,
                  opacity: 0,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--vault-card)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = index < 3 ? "rgba(245,166,35,0.02)" : "transparent")}
              >
                {/* Rank */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    color: index < 3 ? "var(--vault-amber)" : "var(--vault-muted)",
                  }}
                >
                  {index < 3 ? MEDALS[index] : `#${index + 1}`}
                </div>

                {/* Player */}
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "1px solid var(--vault-border)",
                      overflow: "hidden",
                      background: "var(--vault-surface)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {entry.avatar ? (
                      <img src={entry.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--vault-amber)" }}>
                        {entry.username?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--vault-text)" }}>{entry.username}</span>
                </div>

                {/* Total score */}
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--vault-amber)" }}>
                  {entry.totalScore.toLocaleString()}
                </div>

                {/* Games played */}
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--vault-muted)" }}>{entry.gamesPlayed}</div>

                {/* Games won */}
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--vault-green)" }}>{entry.gamesWon}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
