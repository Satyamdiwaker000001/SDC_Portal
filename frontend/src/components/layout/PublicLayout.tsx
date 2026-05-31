import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import GlassButton from '../common/GlassButton';

const PublicLayout: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "/",    label: "Home" },
    { id: "/about", label: "About" },
    { id: "/projects", label: "Projects" },
  ];

  return (
    <div style={{ background: "#000", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      {/* ══ NAVBAR ══════════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000,
        display: "flex", justifyContent: "center",
        paddingTop: "24px", paddingLeft: "24px", paddingRight: "24px",
        transition: "all 0.35s ease",
      }}>
        <div className="liquid-glass" style={{
          borderRadius: "9999px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", maxWidth: "1280px",
          padding: "4px 24px",
          transition: "all 0.35s ease",
          background: scrolled ? "rgba(255,255,255,0.06)" : "transparent"
        }}>
          {/* Logo */}
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "12px", background: "none", border: "none", cursor: "pointer" }}>
            <img src="/logo.png" alt="SDC Logo" style={{ height: "48px", width: "auto", objectFit: "contain", filter: "brightness(2)" }} />
          </button>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {links.map((l) => (
              <button key={l.id} onClick={() => navigate(l.id)}
                style={{
                  fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: location.pathname === l.id ? "#fff" : "rgba(255,255,255,0.7)",
                  background: location.pathname === l.id ? "rgba(255,255,255,0.1)" : "transparent",
                  border: "none", cursor: "pointer",
                  padding: "8px 16px", borderRadius: "9999px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => { 
                  (e.currentTarget as HTMLElement).style.color = "#fff"; 
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={e => { 
                  if (location.pathname !== l.id) {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; 
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >{l.label}</button>
            ))}
          </div>

          {/* Auth buttons */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button onClick={() => navigate("/login")}
              style={{
                fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                color: "#fff", background: "transparent",
                border: "none", cursor: "pointer", transition: "color 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            >Login</button>
            <GlassButton variant="primary" onClick={() => navigate("/register")} style={{ fontSize: "14px" }}>
              Join Us
            </GlassButton>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer style={{ width: "100%", padding: "80px 24px 40px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#050505" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", marginBottom: "64px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <img src="/logo.png" alt="SDC Logo" style={{ height: "100px", width: "auto", filter: "brightness(2)" }} />
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              Engineering tomorrow's solutions, today.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", color: "#fff", textTransform: "uppercase", marginBottom: "24px" }}>Navigation</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
              {links.map(l => (
                <button key={l.id} onClick={() => navigate(l.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)", fontSize: "14px", textAlign: "left", cursor: "pointer", transition: "color 0.2s", padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}>{l.label}</button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", color: "#fff", textTransform: "uppercase", marginBottom: "24px" }}>Social</h4>
            <div style={{ display: "flex", gap: "16px" }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}>
                <span className="material-symbols-outlined">code</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}>
                <span className="material-symbols-outlined">work</span>
              </a>
            </div>
          </div>
        </div>
        
        <div style={{ maxWidth: "1200px", margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
            © 2026 Software Development Cell. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
