import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

function DailyPuzzleCard({ game }) {
  return (
    <Link
      to={`/play/${game._id}`}
      className="group" // Necessary for the button's hover effect
      style={{ textDecoration: "none", display: "block", marginBottom: 40 }}
    >
      <div
        className="daily-vault-card"
        style={{
          background: "var(--vault-card)",
          border: "1px solid var(--vault-border)",
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--vault-amber)";
          e.currentTarget.style.background = "var(--vault-surface)";
          e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--vault-border)";
          e.currentTarget.style.background = "var(--vault-card)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Pixel Effects */}
        <div className="pixel-overlay" />
        <div className="pixel-wave" />

        {/* Content Side */}
        <div style={{ flex: 1, position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ 
              background: "var(--vault-amber)", 
              color: "#0a0a0f", 
              fontFamily: "var(--font-mono)", 
              fontSize: 10, 
              fontWeight: 700, 
              letterSpacing: "0.15em", 
              padding: "3px 10px" 
            }}>
              DAILY_VAULT
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--vault-muted)" }}>
              {game.dailyDate}
            </span>
          </div>
          
          <p style={{ 
            fontFamily: "var(--font-body)", 
            fontSize: 20, 
            color: "var(--vault-text)", 
            margin: 0,
            lineHeight: 1.4
          }}>
            {game.hint}
          </p>
        </div>

        {/* Action Button - Matches GameCard Style */}
        <div
          className="relative overflow-hidden inline-flex items-center justify-center shrink-0"
          style={{
            border: "1px solid var(--vault-border)",
            padding: "10px 24px",
            fontFamily: "var(--font-display)",
            fontSize: 13,
            letterSpacing: "0.15em",
            color: "var(--vault-amber)",
            transition: "all 0.3s ease",
            height: "fit-content"
          }}
        >
          {/* This is the slide-in background that matches your community cards */}
          <div className="absolute inset-0 bg-[var(--vault-amber)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
          
          <span className="relative z-10 group-hover:text-[#0a0a0f] transition-colors duration-300 font-bold">
            INITIATE
          </span>
        </div>
      </div>
    </Link>
  );
}

function GameCard({ game, index }) {
  return (
    <Link
      to={`/play/${game._id}`}
      className="block group"
      style={{ 
        textDecoration: "none", 
        animationDelay: `${index * 0.05}s`, 
        opacity: 0, 
        animation: "slide-up 0.4s ease forwards" 
      }}
    >
      <div
        className="transition-all duration-300 ease-out group-hover:-translate-y-1"
        style={{
          background: "var(--vault-card)",
          border: "1px solid var(--vault-border)",
          height: "320px", // Fixed Height for uniformity
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--vault-amber)";
          e.currentTarget.style.background = "var(--vault-surface)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--vault-border)";
          e.currentTarget.style.background = "var(--vault-card)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--vault-amber)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <div className="p-6 flex flex-col h-full text-left">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div 
              style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--vault-muted)", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "8px" }}
              className="group-hover:text-white transition-colors duration-300"
            >
              {game.creatorAvatar ? (
                <img src={game.creatorAvatar} alt="" style={{ width: 18, height: 18, borderRadius: "50%" }} />
              ) : (
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--vault-amber)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#000" }}>
                   {game.creatorName?.[0]}
                </div>
              )}
              {game.creatorName || "ANONYMOUS"}
            </div>
            {/* <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--vault-muted)" }}>
              {game.wordLength} LTR
            </span> */}
          </div>

          {/* Hint Section: Fixed height and Overflow control */}
          <div 
            className="relative p-4 mb-auto flex flex-col items-center justify-center text-center"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              border: "1px solid var(--vault-border)",
              height: "140px", // Fixed height for the hint box
              overflow: "hidden"
            }}
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--vault-amber)] opacity-30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--vault-amber)] opacity-30" />

            <span style={{ color: "var(--vault-amber)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em", marginBottom: 8 }} className="animate-pulse">
              &gt; TARGET_HINT
            </span>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                color: "var(--vault-text)",
                lineHeight: 1.3,
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 4, // Max lines before "..."
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
              className="group-hover:text-white transition-colors duration-300"
            >
              {game.hint}
            </p>
          </div>

          {/* Start Button */}
          <div
            className="relative overflow-hidden inline-flex items-center justify-center self-start mt-4"
            style={{
              border: "1px solid var(--vault-border)",
              padding: "8px 20px",
              fontFamily: "var(--font-display)",
              fontSize: 12,
              letterSpacing: "0.15em",
              color: "var(--vault-amber)",
              transition: "all 0.3s ease",
            }}
          >
            <div className="absolute inset-0 bg-[var(--vault-amber)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
            <span className="relative z-10 group-hover:text-[#0a0a0f] transition-colors duration-300 font-bold">
              INITIATE
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BrowseGames() {
  const [games, setGames] = useState([]);
  const [dailyGame, setDailyGame] = useState(null);
  const [dailyPlayed, setDailyPlayed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [gamesRes, playedRes, dailyRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/games`, { headers }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/scores/played`, { headers }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/games/daily`, { headers }),
        ]);

        const playedIds = new Set(playedRes.data);
        setDailyGame(dailyRes.data);
        setDailyPlayed(playedIds.has(dailyRes.data?._id));

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
      <div className="mb-10">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-amber)", letterSpacing: "0.2em", marginBottom: 8 }}>
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

      {!loading && dailyGame && !dailyPlayed && (
        <div className="mb-12">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-muted)", letterSpacing: "0.15em", marginBottom: 12 }}>
            // TODAY'S CHALLENGE
          </div>
          <DailyPuzzleCard game={dailyGame} />
        </div>
      )}

      <div className="mb-8">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-muted)", letterSpacing: "0.15em", marginBottom: 12 }}>
          // COMMUNITY VAULTS
        </div>
        <input
          type="text"
          placeholder="SEARCH BY HINT OR CREATOR..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: 480,
            background: "var(--vault-surface)", border: "1px solid var(--vault-border)",
            color: "var(--vault-text)", fontFamily: "var(--font-mono)", fontSize: 12,
            letterSpacing: "0.08em", padding: "12px 16px", outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--vault-amber)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--vault-border)")}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--vault-amber)", letterSpacing: "0.2em" }} className="animate-flicker">
            LOADING VAULTS...
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--vault-muted)" }}>NO VAULTS FOUND</div>
          <Link to="/create" style={{ color: "var(--vault-amber)", fontFamily: "var(--font-mono)", fontSize: 12, textDecoration: "none" }}>
            CREATE THE FIRST ONE →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((game, i) => (
            <GameCard key={game._id} game={game} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}