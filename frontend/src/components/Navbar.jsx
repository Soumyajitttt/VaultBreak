import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: "/create", label: "CREATE" },
    { to: "/browse", label: "PLAY" },
    { to: "/leaderboard", label: "RANKS" },
  ];

  return (
    <nav
      style={{
        background: "rgba(10,10,15,0.95)",
        borderBottom: "1px solid var(--vault-border)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            style={{
              width: 36,
              height: 36,
              background: "var(--vault-amber)",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s",
            }}
            className="group-hover:scale-110"
          >
            <span style={{ fontSize: 16, fontFamily: "var(--font-display)", color: "#0a0a0f" }}>V</span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              letterSpacing: "0.12em",
              color: "var(--vault-amber)",
            }}
            className="animate-flicker"
          >
            VAULTBREAK
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.15em",
                color: location.pathname === to ? "var(--vault-amber)" : "var(--vault-muted)",
                textDecoration: "none",
                borderBottom: location.pathname === to ? "2px solid var(--vault-amber)" : "2px solid transparent",
                paddingBottom: 2,
                transition: "all 0.2s",
              }}
              className="hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button
                style={{
                  background: "transparent",
                  border: "1px solid var(--vault-amber)",
                  color: "var(--vault-amber)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  padding: "8px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.target.style.background = "var(--vault-amber)";
                  e.target.style.color = "#0a0a0f";
                }}
                onMouseLeave={e => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "var(--vault-amber)";
                }}
              >
                SIGN IN
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 36, height: 36, border: "2px solid var(--vault-amber)" },
                },
              }}
            />
          </SignedIn>
        </div>
      </div>

      {/* Mobile links */}
      <div className="md:hidden flex gap-6 px-6 pb-3">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: location.pathname === to ? "var(--vault-amber)" : "var(--vault-muted)",
              textDecoration: "none",
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
