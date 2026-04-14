import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 text-center max-w-3xl animate-slide-up">
        {/* Badge */}
        <div
          className="inline-block mb-8"
          style={{
            border: "1px solid var(--vault-amber)",
            padding: "4px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--vault-amber)",
            letterSpacing: "0.2em",
          }}
        >
          WORD DECRYPTION GAME
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(72px, 14vw, 140px)",
            letterSpacing: "0.05em",
            lineHeight: 0.9,
            color: "var(--vault-text)",
            margin: "0 0 16px",
          }}
          className="animate-flicker"
        >
          VAULT
          <br />
          <span style={{ color: "var(--vault-amber)", WebkitTextStroke: "2px var(--vault-amber)", WebkitTextFillColor: "transparent" }}>
            BREAK
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            color: "var(--vault-muted)",
            marginBottom: 48,
            lineHeight: 1.7,
          }}
        >
          Create encrypted word puzzles. Challenge others to crack them.
          <br />
          Race against time. Claim the leaderboard.
        </p>

        {/* Stats row */}
        {/* <div className="flex justify-center gap-12 mb-12">
          {[
            { label: "ATTEMPTS", value: "6" },
            { label: "TIME LIMIT", value: "2:00" },
            { label: "LETTER REVEAL", value: "A–Z" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--vault-amber)" }}>{value}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--vault-muted)", letterSpacing: "0.15em" }}>{label}</div>
            </div>
          ))}
        </div> */}

        {/* CTA buttons */}
        <SignedIn>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/create"
              style={{
                background: "var(--vault-amber)",
                color: "#0a0a0f",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                letterSpacing: "0.12em",
                padding: "14px 36px",
                textDecoration: "none",
                fontWeight: 700,
                transition: "all 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={e => e.target.style.background = "var(--vault-amber-dim)"}
              onMouseLeave={e => e.target.style.background = "var(--vault-amber)"}
            >
              CREATE GAME
            </Link>
            <Link
              to="/browse"
              style={{
                background: "transparent",
                color: "var(--vault-text)",
                border: "1px solid var(--vault-border)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                letterSpacing: "0.12em",
                padding: "14px 36px",
                textDecoration: "none",
                transition: "all 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={e => { e.target.style.borderColor = "var(--vault-amber)"; e.target.style.color = "var(--vault-amber)"; }}
              onMouseLeave={e => { e.target.style.borderColor = "var(--vault-border)"; e.target.style.color = "var(--vault-text)"; }}
            >
              BROWSE GAMES
            </Link>
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button
              style={{
                background: "var(--vault-amber)",
                color: "#0a0a0f",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                letterSpacing: "0.12em",
                padding: "14px 48px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.target.style.background = "var(--vault-amber-dim)"}
              onMouseLeave={e => e.target.style.background = "var(--vault-amber)"}
            >
              ENTER THE VAULT
            </button>
          </SignInButton>
        </SignedOut>
      </div>

      {/* Bottom hint */}
      <div
        className="absolute bottom-8"
        style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-muted)", letterSpacing: "0.15em" }}
      >
        ▼ CRACK THE CODE ▼
      </div>
    </div>
  );
}
