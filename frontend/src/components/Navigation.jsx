import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 2L4 6.5V13.5C4 19.2 8.4 24.55 14 26C19.6 24.55 24 19.2 24 13.5V6.5L14 2Z"
      fill="url(#shieldGradient)"
      stroke="url(#shieldStroke)"
      strokeWidth="1.2"
    />
    <path d="M10 14l3 3 5-5" stroke="#e2d8ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="shieldGradient" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6c3fc5" stopOpacity="0.8"/>
        <stop offset="1" stopColor="#2a1a5e" stopOpacity="0.9"/>
      </linearGradient>
      <linearGradient id="shieldStroke" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa"/>
        <stop offset="1" stopColor="#6c3fc5"/>
      </linearGradient>
    </defs>
  </svg>
);

const navLinks = [
  { path: "/", label: "Home", icon: "⌂" },
  { path: "/login", label: "Login", icon: "⬡" },
  { path: "/feed", label: "Feed", icon: "◈" },
  { path: "/wellness", label: "Wellness", icon: "♡" },
];

export default function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "linear-gradient(180deg, rgba(10,13,26,0.98) 0%, rgba(10,13,26,0.92) 100%)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(124,58,237,0.25)",
        boxShadow: "0 0 32px rgba(109,40,217,0.12)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="transition-transform group-hover:scale-110 duration-200">
            <ShieldIcon />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              background: "linear-gradient(90deg, #c4b5fd 0%, #a78bfa 50%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            ShieldHer
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ path, label, icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group"
                style={{
                  color: isActive ? "#c4b5fd" : "rgba(196,181,253,0.55)",
                  background: isActive
                    ? "rgba(109,40,217,0.18)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(124,58,237,0.4)"
                    : "1px solid transparent",
                }}
              >
                <span
                  className="text-xs"
                  style={{ color: isActive ? "#a78bfa" : "rgba(167,139,250,0.4)" }}
                >
                  {icon}
                </span>
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Badge */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#34d399",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Shield Active
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-0.5 rounded-full transition-all duration-200"
              style={{ background: "rgba(167,139,250,0.7)" }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-4 flex flex-col gap-1"
          style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}
        >
          {navLinks.map(({ path, label, icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  color: isActive ? "#c4b5fd" : "rgba(196,181,253,0.55)",
                  background: isActive ? "rgba(109,40,217,0.15)" : "transparent",
                }}
              >
                <span className="text-base" style={{ color: "#7c3aed" }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
