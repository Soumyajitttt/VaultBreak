import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

function GameCard({ game, index }) {
  const blanks = Array(game.wordLength).fill("_");

  return (
    <Link
      to={`/play/${game._id}`}
      className="block group"
      style={{ textDecoration: "none", animationDelay: `${index * 0.05}s`, opacity: 0, animation: "slide-up 0.4s ease forwards" }}
    >
      <div
        style={{
          background: "var(--vault-card)",
          border: "1px solid var(--vault-border)",
          padding: "24px",
          transition: "all 0.25s",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--vault-amber)";
          e.currentTarget.style.background = "var(--vault-surface)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--vault-border)";
          e.currentTarget.style.background = "var(--vault-card)";
        }}
      >
        {/* Top bar accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "var(--vault-amber)",
            transform: "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.3s",
          }}
          className="group-hover:[transform:scaleX(1)]"
        />

        {/* Word blanks */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {blanks.map((_, i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 38,
                borderBottom: "2px solid var(--vault-amber)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 18,
                color: "var(--vault-muted)",
              }}
            >
              _
            </div>
          ))}
        </div>

        {/* Hint */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--vault-text)",
            marginBottom: 16,
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: "var(--vault-amber)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em" }}>HINT: </span>
          {game.hint}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {game.creatorAvatar ? (
              <img src={game.creatorAvatar} alt="" style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid var(--vault-border)" }} />
            ) : (
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "var(--vault-amber)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#0a0a0f",
                  fontWeight: 700,
                }}
              >
                {game.creatorName?.[0]?.toUpperCase()}
              </div>
            )}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-muted)" }}>{game.creatorName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--vault-muted)" }}>
              {game.wordLength} LETTERS
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--vault-muted)" }}>
              {game.playCount} PLAYS
            </span>
          </div>
        </div>

        {/* Play arrow */}
        <div
          style={{
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%) translateX(10px)",
            fontFamily: "var(--font-display)",
            fontSize: 24,
            color: "var(--vault-amber)",
            opacity: 0,
            transition: "all 0.2s",
          }}
          className="group-hover:opacity-100 group-hover:[transform:translateY(-50%)_translateX(0)]"
        >
          →
        </div>
      </div>
    </Link>
  );
}

export default function BrowseGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [gamesRes, playedRes] = await Promise.all([
          axios.get("/api/games", { headers }),
          axios.get("/api/scores/played", { headers }),
        ]);

        const playedIds = new Set(playedRes.data);

        const available = gamesRes.data.filter((g) => {
          const isOwn = g.createdBy === user?.id;
          const isPlayed = playedIds.has(g._id);
          return !isOwn && !isPlayed;
        });

        setGames(available);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filtered = games.filter(
    (g) =>
      g.hint?.toLowerCase().includes(search.toLowerCase()) ||
      g.creatorName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-amber)", letterSpacing: "0.2em", marginBottom: 8 }}
        >
          // SELECT TARGET
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 52, color: "var(--vault-text)", margin: 0, letterSpacing: "0.05em" }}>
            BROWSE GAMES
          </h1>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--vault-muted)" }}>
            {games.length} VAULTS AVAILABLE
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="SEARCH BY HINT OR CREATOR..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 480,
            background: "var(--vault-surface)",
            border: "1px solid var(--vault-border)",
            color: "var(--vault-text)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            padding: "12px 16px",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--vault-amber)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--vault-border)")}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "var(--vault-amber)",
              letterSpacing: "0.2em",
            }}
            className="animate-flicker"
          >
            LOADING VAULTS...
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--vault-muted)" }}>NO VAULTS FOUND</div>
          <Link
            to="/create"
            style={{ color: "var(--vault-amber)", fontFamily: "var(--font-mono)", fontSize: 12, textDecoration: "none" }}
          >
            CREATE THE FIRST ONE →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((game, i) => (
            <GameCard key={game._id} game={game} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}