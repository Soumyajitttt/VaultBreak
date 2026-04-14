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
        <Link to="/" className="flex items-center gap-4 group">
          {/* Hexagonal Icon Container */}
          <div className="relative flex items-center justify-center w-9 h-9 transition-all duration-500 ease-out group-hover:rotate-6">
            {/* Hexagon Background */}
            <div 
              className="absolute inset-0 transition-colors duration-300"
              style={{
                background: "linear-gradient(135deg, var(--vault-amber) 0%, #d4a017 100%)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            {/* The Lettering */}
            <span className="relative z-10 text-slate-950 font-bold text-sm tracking-tighter">
              V
            </span>
          </div>

          {/* Typography Section */}
          <div className="flex flex-col leading-none">
            <span 
              className="text-xl tracking-[0.15em] font-display transition-all duration-300 group-hover:text-white"
              style={{ color: "var(--vault-amber)" }}
            >
              <span className="font-black">VAULT</span>
              <span className="font-light opacity-90">BREAK</span>
            </span>
            {/* Subtle underline accent */}
            <div className="h-[1px] w-0 bg-amber-400/50 transition-all duration-500 group-hover:w-full mt-1" />
          </div>
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
