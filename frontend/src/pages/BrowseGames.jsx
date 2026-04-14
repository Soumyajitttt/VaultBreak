import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

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
          minHeight: "260px", // Slightly taller to accommodate larger text
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
        {/* Animated Top Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--vault-amber)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <div className="p-6 flex flex-col h-full flex-grow text-left">
          
          {/* Header: Creator Name (Left) & Meta (Right) */}
          <div className="flex justify-between items-center mb-5">
            <div 
              style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: 11, 
                color: "var(--vault-muted)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              className="group-hover:text-white transition-colors duration-300"
            >
              {game.creatorAvatar && (
                <img 
                  src={game.creatorAvatar} 
                  alt="" 
                  style={{ width: 20, height: 20, borderRadius: "50%", border: "1px solid var(--vault-border)" }} 
                />
              )}
              {game.creatorName || "UNKNOWN"}
            </div>
            
          </div>

          {/* Hint Section: Centered & Larger Text */}
          <div 
            className="relative p-6 mb-6 flex-grow flex flex-col items-center justify-center transition-colors duration-300 text-center"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              border: "1px solid var(--vault-border)",
            }}
          >
            {/* Tech Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--vault-amber)] opacity-50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--vault-amber)] opacity-50" />

            <span 
              style={{ 
                color: "var(--vault-amber)", 
                fontFamily: "var(--font-mono)", 
                fontSize: 10, 
                letterSpacing: "0.2em",
                display: "block",
                marginBottom: 12,
              }}
              className="animate-pulse"
            >
              &gt; TARGET_HINT
            </span>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 22, // Significantly increased from 15px
                color: "var(--vault-text)",
                lineHeight: 1.4,
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 3, // Still caps at 3 lines to prevent breaking layout
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
              className="group-hover:text-white transition-colors duration-300"
            >
              {game.hint}
            </p>
          </div>

          {/* Start Button (Left Aligned) */}
          <div
            className="relative overflow-hidden inline-flex items-center justify-center self-start"
            style={{
              border: "1px solid var(--vault-border)",
              padding: "8px 28px",
              fontFamily: "var(--font-display)",
              fontSize: 14,
              letterSpacing: "0.15em",
              color: "var(--vault-amber)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              background: "transparent",
              marginTop: "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--vault-amber)";
              e.currentTarget.style.letterSpacing = "0.3em";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--vault-border)";
              e.currentTarget.style.letterSpacing = "0.15em";
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